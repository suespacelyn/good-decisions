"use client";

import { PageHeader } from "@/components/app-shell/page-header";
import { CommunityFeed } from "@/features/community/components/community-feed";
import { NotificationsButton } from "@/features/community/components/notifications-button";

export default function CommunityPage() {
  return (
    <div>
      <PageHeader
        title="Community"
        subtitle="Swap good money tips with friends."
        action={<NotificationsButton />}
      />
      <CommunityFeed />
    </div>
  );
}
