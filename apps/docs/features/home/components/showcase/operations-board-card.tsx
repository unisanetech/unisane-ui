"use client";

import {
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  Surface,
} from "@unisane/ui";

function MenuIcon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined text-[18px] leading-none">
      {name}
    </span>
  );
}

export function OperationsBoardCard() {
  return (
    <Card variant="filled" className="h-full overflow-hidden bg-surface">
      <Card.Content className="h-full p-0">
        <Surface tone="tertiaryContainer" rounded="sm" className="relative h-full p-4">
          <div className="absolute top-4 right-4">
            <DropdownMenu open={true} onOpenChange={() => {}}>
              <DropdownMenuTrigger asChild>
                <IconButton
                  variant="standard"
                  size="sm"
                  className="pointer-events-none"
                  aria-label="More actions"
                >
                  <MenuIcon name="more_horiz" />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                portal={false}
                align="end"
                side="bottom"
                className="mt-1 rounded-sm px-2"
              >
                <DropdownMenuItem
                  className="rounded-sm"
                  icon={<MenuIcon name="edit" />}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-sm"
                  icon={<MenuIcon name="content_copy" />}
                >
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-sm"
                  icon={<MenuIcon name="share" />}
                >
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-sm"
                  icon={<MenuIcon name="download" />}
                >
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-sm"
                  icon={<MenuIcon name="archive" />}
                >
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Surface>
      </Card.Content>
    </Card>
  );
}
