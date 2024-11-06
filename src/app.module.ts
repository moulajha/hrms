import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AssociatesModule } from './modules/associates/associates.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DeploymentsModule } from './modules/deployments/deployments.module';
import { PrismaService } from './config/prisma.service';
import { SupabaseService } from './config/supabase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    OrganizationsModule,
    AssociatesModule,
    ClientsModule,
    DeploymentsModule,
  ],
  providers: [PrismaService, SupabaseService],
})
export class AppModule {}