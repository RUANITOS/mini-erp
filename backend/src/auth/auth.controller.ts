import { Body, Controller, Post, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Registrar um novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
    @ApiResponse({ status: 409, description: 'Email já em uso.' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login de usuário' })
    @ApiResponse({ status: 201, description: 'Login realizado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('me')
    @ApiOperation({ summary: 'Retorna informações do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Usuário autenticado.' })
    getProfile(@Request() req) {
        return req.user;
    }
}
