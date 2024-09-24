import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

import { Feather } from "@expo/vector-icons";
import { useBottomSheetModal } from "@/context/BottomSheet";

import { useUser } from "@/context/Auth";

import Wrapper from "@/components/Settings/Wrapper";
import Icon from "@/components/Core/Icon";
import { ProfileItem } from "./profile";
import axiosInstance from "@/lib/axios";
import Input from "@/components/Core/Input";
import EditItem from "@/components/Settings/EditItem";
import { useRouter } from "expo-router";

const Profile = () => {
  const { user, logOut, loggingOut } = useUser();
  const { showModal } = useBottomSheetModal();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [confirmation, setConfirmation] = React.useState<
    "logout" | "delete" | ""
  >("");

  const showLoading = loading || loggingOut;

  const showEditItem = () => {
    showModal(
      <EditItem name="email" title="Update email" val={user?.email!} />
    );
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/users/${user?.id}`);
      logOut();
    } catch (error) {
      //@ts-ignore
      setMessage(error?.response?.data?.error ?? error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (name: typeof confirmation) => {
    setConfirmation(name);
  };

  const { navigate } = useRouter();
  const disabled = !!confirmation;

  return (
    <Wrapper>
      <View className="space-y-1 mt-4 flex-1 ">
        {message && <Text className="text-red-500 text-center">{message}</Text>}
        <Text className="text-base font-fwbold text-neutral-500">
          Login and security
        </Text>
        <View>
          <ProfileItem
            name="email"
            disabled={disabled}
            value={user?.email as string}
            action={() => showEditItem()}
          />
          <ProfileItem
            name="password"
            disabled={disabled}
            value={"• • • • • • • •" as string}
            action={() =>
              navigate({
                pathname: "/(forgot-password)",
                params: { email: user?.email },
              })
            }
          />
        </View>
        <View className="flex-1">
          <TouchableOpacity
            disabled={!!confirmation}
            onPress={() => handleAction("logout")}
            className="flex-row items-center space-x-3 bg-gray-200 h-[50] px-4 rounded-xl mt-12 "
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
              disabled={!!confirmation}
              onPress={() => handleAction("delete")}
              className="flex-row items-center justify-center space-x-3 bg-[#f871712d]  h-[50] px-4 rounded-full  "
            >
              <Text className="text-sm text-center flex-1 font-fwbold text-[#f87171] ">
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

      {confirmation && (
        <View className=" absolute  h-screen flex-1 bg-[#1a1a1a1e] w-screen px-3">
          <View className="mt-auto mb-20 space-y-2">
            <TouchableOpacity
              className="bg-white h-[50] items-center justify-center rounded-full flex-row space-x-2 "
              onPress={confirmation === "logout" ? logOut : deleteAccount}
            >
              <Text className="text-sm text-center font-fwbold text-[#f87171] ">
                {confirmation === "logout" ? "Log out?" : "Confirm"}
              </Text>
              {showLoading && <ActivityIndicator color="red" size="small" />}
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white h-[50] justify-center items-center rounded-full "
              onPress={() => setConfirmation("")}
            >
              <Text className="text-sm text-center font-fwbold text-blue-500 ">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Wrapper>
  );
};

export default Profile;
