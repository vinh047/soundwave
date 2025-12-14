import "server-only";
import { Prisma } from "@repo/database";
import axiosServer from "./axiosServer";

export const trackApiServer = {
  getTrendingTracks: async (limit: number) => {
    return axiosServer.get<
      Prisma.TrackGetPayload<{
        include: {
          user: true;
          likes: true;
          reposts: true;
          _count: { select: { likes: true; reposts: true; comments: true } };
        };
      }>[]
    >(`/tracks/trending?limit=${limit}`);
  },

};
