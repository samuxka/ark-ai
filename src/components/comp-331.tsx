"use client";

import { useId } from "react";
import { CheckIcon, ImagePlusIcon, Trash2, Trash2Icon, User, XIcon } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";

export default function Component() {
  const { data: session } = useSession();
  const id = useId();
  const maxLength = 180;

  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue:
      "Hey, I am Margaret, a web developer who loves turning ideas into amazing websites!",
  });

  const initialAvatarImage = [
    {
      name: "avatar-72-01.jpg",
      size: 1528737,
      type: "image/jpeg",
      url: session?.user?.image || "/user.jpeg",
      id: "avatar-123456789",
      preview: session?.user?.image || "/user.jpeg", // Add preview for initial file
    },
  ];

  function Avatar() {
    const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
      accept: "image/*",
      initialFiles: initialAvatarImage,
    });

    return (
      <div className="-mt-10 px-6">
        <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
          <Image
            src={session?.user?.image || "/user.jpeg"}
            className="size-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label="Change profile picture"
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload profile picture"
          />
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center justify-between cursor-pointer p-2">
          Profile
          <User className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a username.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="h-32 bg-zinc-900"></div>
          <Avatar />
          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${id}-first-name`}>First name</Label>
                  <Input
                    id={`${id}-first-name`}
                    placeholder="Matt"
                    defaultValue={session?.user?.name?.split(" ")[0] || ""}
                    type="text"
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${id}-last-name`}>Last name</Label>
                  <Input
                    id={`${id}-last-name`}
                    placeholder="Welsh"
                    defaultValue={session?.user?.name?.split(" ")[1] || ""}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-username`}>Username</Label>
                <div className="relative">
                  <Input
                    id={`${id}-username`}
                    className="peer pe-9"
                    placeholder="Username"
                    defaultValue={session?.user?.username || ""}
                    type="text"
                    required
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                    <CheckIcon
                      size={16}
                      className="text-emerald-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <div className="flex rounded-md shadow-xs">
                  <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                    @
                  </span>
                  <Input
                    id={`${id}-email`}
                    className="-ms-px rounded-s-none shadow-none"
                    placeholder="youremail@mail.com"
                    defaultValue={session?.user?.email || ""}
                    type="text"
                    disabled
                  />
                </div>
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-bio`}>Biography</Label>
                <Textarea
                  id={`${id}-bio`}
                  placeholder="Write a few sentences about yourself"
                  defaultValue={session?.user?.bio || ""}
                  maxLength={maxLength}
                  onChange={handleChange}
                  aria-describedby={`${id}-description`}
                />
                <p
                  id={`${id}-description`}
                  className="text-muted-foreground mt-2 text-right text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">{limit - characterCount}</span>{" "}
                  characters left
                </p>
              </div>
            </form>
          </div>
          <div className="px-6 pt-4 pb-6 grid grid-cols-6">
            <h1 className="col-span-2">Toggle theme:</h1>
            <div className="empty col-span-2"></div>
            <div className="empty col-span-2">
              <ModeToggle />
            </div>
          </div>
          <div className="px-6 pt-4 pb-6 ">
            <h1>Danger area:</h1>
            <div className="grid grid-cols-6">
              <h3 className="col-span-2 text-sm">Delete all chats:</h3>
              <div className="empty col-span-2"></div>
              <Button className="col-span-2 flex items-center bg-red-600 hover:bg-red-500 cursor-pointer transition-colors text-white">
                Delete
                <Trash2 />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}