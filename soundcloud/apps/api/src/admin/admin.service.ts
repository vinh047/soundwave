import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [totalUsers, totalTracks, pendingReports] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.track.count(),
            this.prisma.report.count({
                where: { status: 'PENDING' },
            }),
        ]);

        return {
            totalUsers,
            totalTracks,
            pendingReports,
        };
    }
}
