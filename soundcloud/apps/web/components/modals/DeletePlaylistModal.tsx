"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui2/Dialog";
import { Button } from "@/components/ui2/Button";

interface DeletePlaylistModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    playlistName: string;
}

export default function DeletePlaylistModal({
    isOpen,
    onOpenChange,
    onConfirm,
    playlistName,
}: DeletePlaylistModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#181818] text-white border-none">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Delete playlist</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-300">
                        Are you sure you want to delete {playlistName}? This action cannot be
                        undone.
                    </p>
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                        className="bg-white text-black hover:bg-gray-200 font-bold"
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
