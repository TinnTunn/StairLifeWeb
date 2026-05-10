"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(chatService, jwtService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                client.emit('error', { message: 'Token tidak ditemukan' });
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.sub || payload.id;
            if (!userId) {
                client.emit('error', { message: 'Token tidak valid' });
                client.disconnect();
                return;
            }
            client.data.userId = userId;
            client.data.userRole = payload.role;
            client.data.userName = payload.full_name || payload.name;
            this.connectedUsers.set(client.id, userId);
            console.log(`[WS] Connected: ${userId} (socket: ${client.id})`);
        }
        catch (err) {
            client.emit('error', { message: 'Autentikasi gagal' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedUsers.delete(client.id);
        console.log(`[WS] Disconnected: ${client.id}`);
    }
    async handleJoinRoom(client, data) {
        const { contractId } = data;
        const userId = client.data.userId;
        if (!userId) {
            throw new websockets_1.WsException('Tidak terautentikasi');
        }
        const hasAccess = await this.chatService.validateContractAccess(contractId, userId);
        if (!hasAccess) {
            client.emit('error', { message: 'Tidak punya akses ke room ini' });
            return;
        }
        const roomName = `contract:${contractId}`;
        const currentRooms = Array.from(client.rooms).filter((r) => r !== client.id && r.startsWith('contract:'));
        for (const room of currentRooms) {
            client.leave(room);
        }
        client.join(roomName);
        await this.chatService.markAsRead(contractId, userId);
        const messages = await this.chatService.getMessages(contractId);
        client.emit('message_history', { contractId, messages });
        client.to(roomName).emit('user_joined', {
            userId,
            userName: client.data.userName,
        });
        console.log(`[WS] ${userId} joined room ${roomName}`);
    }
    handleLeaveRoom(client, data) {
        const roomName = `contract:${data.contractId}`;
        client.leave(roomName);
        console.log(`[WS] ${client.data.userId} left room ${roomName}`);
    }
    async handleSendMessage(client, data) {
        const { contractId, content } = data;
        const userId = client.data.userId;
        if (!userId)
            throw new websockets_1.WsException('Tidak terautentikasi');
        if (!content?.trim())
            throw new websockets_1.WsException('Pesan tidak boleh kosong');
        const hasAccess = await this.chatService.validateContractAccess(contractId, userId);
        if (!hasAccess) {
            client.emit('error', { message: 'Tidak punya akses' });
            return;
        }
        const message = await this.chatService.saveMessage(contractId, userId, content.trim());
        const roomName = `contract:${contractId}`;
        this.server.to(roomName).emit('new_message', {
            contractId,
            message,
        });
        console.log(`[WS] Message in ${roomName} from ${userId}`);
    }
    handleTyping(client, data) {
        const roomName = `contract:${data.contractId}`;
        client.to(roomName).emit('user_typing', {
            userId: client.data.userId,
            userName: client.data.userName,
            isTyping: data.isTyping,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/chat',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map