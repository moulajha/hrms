import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, AuthResponse } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new organization' })
  @ApiResponse({ status: 201, type: AuthResponse })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in to organization account' })
  @ApiResponse({ status: 200, type: AuthResponse })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(signInDto);
  }
}