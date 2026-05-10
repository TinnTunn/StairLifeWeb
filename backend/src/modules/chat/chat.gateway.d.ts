import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    private jwtService;
    server: Server;
    private connectedUsers;
    constructor(chatService: ChatService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: {
        contractId: string;
    }): Promise<void>;
    handleLeaveRoom(client: Socket, data: {
        contractId: string;
    }): void;
    handleSendMessage(client: Socket, data: {
        contractId: string;
        content: string;
    }): Promise<void>;
    handleTyping(client: Socket, data: {
        contractId: string;
        isTyping: boolean;
    }): void;
}
