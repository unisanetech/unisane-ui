'use client';

import { Typography } from '@unisane/ui/typography';
import { Icon } from '@unisane/ui/icon';
import type { User } from './types';

export function ExpandedRowContent({ row }: { row: User }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div>
        <Typography variant="labelMedium" className="text-on-surface-variant mb-2">
          Contact Information
        </Typography>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon symbol="email" className="text-on-surface-variant h-4 w-4" />
            <span className="text-body-small">{row.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon symbol="badge" className="text-on-surface-variant h-4 w-4" />
            <span className="text-body-small">ID: {row.id}</span>
          </div>
        </div>
      </div>
      <div>
        <Typography variant="labelMedium" className="text-on-surface-variant mb-2">
          Work Information
        </Typography>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon symbol="apartment" className="text-on-surface-variant h-4 w-4" />
            <span className="text-body-small">{row.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon symbol="payments" className="text-on-surface-variant h-4 w-4" />
            <span className="text-body-small">${row.salary.toLocaleString()}/year</span>
          </div>
        </div>
      </div>
      <div>
        <Typography variant="labelMedium" className="text-on-surface-variant mb-2">
          Activity
        </Typography>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon symbol="folder" className="text-on-surface-variant h-4 w-4" />
            <span className="text-body-small">{row.projects} active projects</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon symbol="calendar_today" className="text-on-surface-variant h-4 w-4" />
            <span className="text-body-small">Joined {row.joinDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
