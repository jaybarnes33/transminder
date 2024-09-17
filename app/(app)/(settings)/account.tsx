import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useBottomSheetModal } from "@/context/BottomSheet";
import EditItem from "@/components/Settings/EditItem";

import { useUser } from "@/context/Auth";
import { splitCamelCase } from "@/utils";
import Wrapper from "@/components/Settings/Wrapper";
import Icon from "@/components/Core/Icon";

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
      <Text className="text-base capitalize text-neutral-700 font-semibold font-main">
        {splitCamelCase(name)}
      </Text>
      <View className="flex-row items-center space-x-2">
        <Text className="text-base text-dark font-main font-fwbold">
          {value}
        </Text>
        <TouchableOpacity onPress={action}>
          <Feather name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const Profile = () => {
  const { user, logOut } = useUser();
  const { showModal } = useBottomSheetModal();

  const showEditItem = (details: {
    name: string;
    title: string;
    val: string;
  }) => {
    showModal(<EditItem {...details} />);
  };

  return (
    <Wrapper>
      <View className="space-y-1 mt-4 flex-1 ">
        <Text className="font-main text-base font-fwbold text-neutral-500">
          Login and security
        </Text>
        <View>
          <ProfileItem
            name="email"
            value={user?.email as string}
            action={() =>
              showEditItem({
                name: "email",
                title: "Update email",
                val: user?.email as string,
              })
            }
          />
          <ProfileItem
            name="password"
            value={"• • • • • • • •" as string}
            action={() =>
              showEditItem({
                name: "password",
                title: "Update password",
                val: "" as string,
              })
            }
          />
        </View>
        <View className="flex-1">
          <TouchableOpacity
            onPress={logOut}
            className="flex-row items-center space-x-3 bg-neutral-200 h-[50] px-4 rounded-xl mt-12 "
          >
            <Icon name="logout" />
            <Text className="font-main text-base flex-1 font-semibold text-neutral-700 capitalize">
              Logout
            </Text>

            <Feather name="chevron-right" size={20} color={"gray"} />
          </TouchableOpacity>

          <View className="mt-16 space-y-2">
            <Text className="font-main text-base  font-semibold text-neutral-500">
              Account and data{" "}
            </Text>
            <TouchableOpacity
              onPress={() => "Delete account"}
              className="flex-row items-center justify-center space-x-3 bg-[#f871712d]  h-[50] px-4 rounded-full  "
            >
              <Text className="font-main text-sm text-center flex-1 font-fwbold text-[#f87171] ">
                Delete my account
              </Text>
            </TouchableOpacity>
            <Text className="font-main text-sm text-neutral-500 font-semibold pr-10">
              Warning: Deleting your account will permanently erase all data
              associated with Transminder.
            </Text>
          </View>
        </View>
      </View>
    </Wrapper>
  );
};

export default Profile;
