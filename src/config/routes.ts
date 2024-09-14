import { Event } from "@prisma/client";

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

type EventRouteParams = {
  ownerId: Event["id"];
  eventSlug: Event["slug"];
};

export default {
  home: "/",
  register: "/api/auth/register",
  login: "/api/auth/login",
  dashboard: "/dashboard",
  account: "/dashboard/account",
  bookmarked: "/dashboard/bookmarks",
  event: ({ ownerId, eventSlug }: EventRouteParams) =>
    `/events/${ownerId}/${eventSlug}`,
  eventPolls: ({ ownerId, eventSlug }: EventRouteParams) =>
    `/events/${ownerId}/${eventSlug}/polls`,
} as const;
