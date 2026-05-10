import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SupabaseService } from '../../config/supabase.config';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

class DirectMessageDto {
  @IsUUID()
  receiver_id: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private supabase: SupabaseService) {}

  @Get('rooms')
  async getMyRooms(@CurrentUser() user: any) {
    const supabase = this.supabase.getClient();
    const { data: contracts } = await supabase
      .from('contracts')
      .select(`
        id, status, agreed_budget,
        projects!project_id (id, title),
        users_contracts_student_idTousers:users!student_id (id, full_name),
        users_contracts_business_idTousers:users!business_id (id, full_name)
      `)
      .or(`student_id.eq.${user.id},business_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    return { data: contracts || [], message: 'Berhasil' };
  }

  @Get(':contractId/messages')
  async getMessages(
    @Param('contractId') contractId: string,
    @CurrentUser() user: any,
  ) {
    const { data, error } = await this.supabase.getClient()
      .from('messages')
      .select(`
        *,
        sender:users!sender_id (id, full_name, role)
      `)
      .eq('contract_id', contractId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return { data, message: 'Berhasil' };
  }

  @Post(':contractId/messages')
  async sendMessage(
    @Param('contractId') contractId: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: any,
  ) {
    const { data, error } = await this.supabase.getClient()
      .from('messages')
      .insert({
        contract_id: contractId,
        sender_id: user.id,
        content: dto.content,
        created_at: new Date().toISOString(),
      })
      .select(`
        *,
        sender:users!sender_id (id, full_name, role)
      `)
      .single();

    if (error) throw new Error(error.message);
    return { data, message: 'Pesan terkirim' };
  }

  @Post('direct')
  async sendDirectMessage(
    @Body() dto: DirectMessageDto,
    @CurrentUser() user: any,
  ) {
    const supabase = this.supabase.getClient();

    const { data: contract } = await supabase
      .from('contracts')
      .select('id')
      .or(
        `and(student_id.eq.${user.id},business_id.eq.${dto.receiver_id}),and(student_id.eq.${dto.receiver_id},business_id.eq.${user.id})`
      )
      .limit(1)
      .maybeSingle();

    if (!contract) {
      return {
        data: null,
        message: 'Belum ada kontrak. Chat tersedia setelah kontrak dibuat.',
      };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        contract_id: contract.id,
        sender_id: user.id,
        content: dto.content,
        created_at: new Date().toISOString(),
      })
      .select(`*, sender:users!sender_id (id, full_name, role)`)
      .single();

    if (error) throw new Error(error.message);
    return { data, message: 'Pesan terkirim' };
  }
}