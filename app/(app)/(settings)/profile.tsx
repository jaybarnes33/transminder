import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Avatar from "@/components/Core/Avatar";

import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useBottomSheetModal } from "@/context/BottomSheet";
import EditItem from "@/components/Settings/EditItem";

import { useUser } from "@/context/Auth";

const ProfileItem = ({
  name,
  value,
  action,
}: {
  name: string;
  value: string;
  action?: () => void;
}) => {
  return (
    <View className="flex-row items-center justify-between  bg-neutral-200 h-[50] px-4 rounded-xl mb-1">
      <Text className="text-base text-neutral-700 font-semibold font-main">
        {name}
      </Text>
      <View className="flex-row items-center space-x-2">
        <Text className="text-base text-dark font-main font-bold">{value}</Text>
        <TouchableOpacity onPress={action}>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const Profile = () => {
  const { user } = useUser();
  const { showModal } = useBottomSheetModal();

  const showEditName = () => {
    showModal(
      <EditItem name="name" title="Edit Name" val={user?.name as string} />
    );
  };

  const showEditGender = () => {
    showModal(
      <EditItem
        name="genderIdentity"
        title="Edit Gender"
        val={user?.genderIdentity as string}
      />
    );
  };
  return (
    <View className="flex-1">
      <View className="items-center space-y-4">
        <Avatar size="xl" name={user?.name as string} />
        <TouchableOpacity className="items-center">
          <View className="items-center flex-row space-x-2">
            <FontAwesome6 name="camera" size={16} color="#a855f7" />
            <Text className="font-main text-base font-bold text-[#a855f7]">
              Add photo
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="mt-7">
        <ProfileItem
          name="Name"
          value={user?.name as string}
          action={() => showEditName()}
        />
        <ProfileItem
          name="Gender Identity"
          value={user?.genderIdentity as string}
          action={() => showEditGender()}
        />
      </View>
    </View>
  );
};

export default Profile;
