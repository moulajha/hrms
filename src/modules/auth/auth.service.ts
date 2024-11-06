import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../config/supabase.config';
import { PrismaService } from '../../config/prisma.service';
import { SignUpDto, SignInDto, AuthResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const { data: authData, error: authError } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email: dto.email,
        password: dto.password,
      });

    if (authError) throw new UnauthorizedException(authError.message);

    const organization = await this.prisma.organization.create({
      data: {
        name: dto.organizationName,
        email: dto.email,
      },
    });

    return {
      access_token: authData.session.access_token,
      organization_id: organization.id,
    };
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const { data: authData, error: authError } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (authError) throw new UnauthorizedException(authError.message);

    const organization = await this.prisma.organization.findUnique({
      where: { email: dto.email },
    });

    return {
      access_token: authData.session.access_token,
      organization_id: organization.id,
    };
  }
}