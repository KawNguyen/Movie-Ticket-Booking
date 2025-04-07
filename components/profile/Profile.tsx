"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

// Update the ProfileProps interface
interface ProfileProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export const Profile = ({ user }: ProfileProps) => {
  const [profileData, setProfileData] = useState<User>({
    name: user.name || "Anonymous",
    email: user.email || "",
    avatar: user.image || "",
    role: user.role,
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    avatar: false,
  });

  const onEdit = (field: keyof User) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const onSave = (field: keyof User, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const onCancel = (field: keyof User) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
      <Card className="mt-6 bg-gray-900 text-white p-4 sm:p-6">
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-6 sm:space-y-0">
            <div className="relative flex justify-center">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage src={profileData.avatar} alt="User avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-white text-black hover:bg-gray-200 whitespace-nowrap"
                onClick={() => onEdit("avatar")}
              >
                Change Avatar
              </Button>
            </div>

            <div className="flex-1 space-y-4 sm:space-y-6">
              <div>
                <Label className="font-medium text-base sm:text-lg">
                  Full Name
                </Label>
                {!isEditing.name ? (
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-400">{profileData.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2 mt-2">
                    <Input
                      defaultValue={profileData.name}
                      onBlur={(e) => onSave("name", e.target.value)}
                      className="w-full sm:w-2/3"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button onClick={() => onSave("name", profileData.name)}>
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onCancel("name")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="font-medium text-base sm:text-lg">
                  Email
                </Label>
                <p className="text-gray-400 mt-2">{profileData.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
