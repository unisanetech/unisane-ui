'use client';

import { Button, Card, Pagination, Surface, Typography } from '@unisane/ui';
import { Badge } from '@unisane/ui/badge';

export function ReviewQueueBlock() {
  return (
    <Card variant="outlined" className="h-full w-full">
      <Card.Header>
        <Card.Title>Review queue</Card.Title>
        <Card.Description>Prioritized work ready for handoff and approval.</Card.Description>
      </Card.Header>
      <Card.Content className="space-y-3">
        {[
          ['Invoice review', 'Ready', 'Ops'],
          ['Billing handoff', 'Blocked', 'Finance'],
          ['Access issue', 'Review', 'Support'],
        ].map(([name, status, owner]) => (
          <Surface
            key={name}
            tone="surfaceContainerLow"
            rounded="sm"
            className="grid grid-cols-[minmax(0,1.6fr)_100px_80px] items-center gap-3 p-3"
          >
            <Typography variant="bodyMedium">{name}</Typography>
            <Badge variant="tonal">{status}</Badge>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              {owner}
            </Typography>
          </Surface>
        ))}
      </Card.Content>
      <Card.Footer className="justify-between">
        <Pagination currentPage={2} totalPages={8} onPageChange={() => {}} />
        <Button variant="tonal" size="sm" className="pointer-events-none">
          Open table
        </Button>
      </Card.Footer>
    </Card>
  );
}
