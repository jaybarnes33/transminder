import { View, Text, TouchableOpacity } from "react-native";

import Avatar from "@/components/Core/Avatar";

import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useBottomSheetModal } from "@/context/BottomSheet";
import EditItem from "@/components/Settings/EditItem";

import { useUser } from "@/context/Auth";
import { splitCamelCase } from "@/utils";

import Wrapper from "@/components/Settings/Wrapper";
import { getAvatar } from "@/utils/auth";
import AddAvatar from "@/components/Core/AddAvatar";

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
  const { user } = useUser();
  const { showModal } = useBottomSheetModal();

  const showEditItem = (details: {
    name: string;
    title: string;
    val: string;
  }) => {
    showModal(<EditItem {...details} />);
  };

  const items = [
    { name: "name", val: user?.name as string },
    { name: "genderIdentity", val: user?.genderIdentity as string },
    { name: "age", val: user?.age as string },
    { name: "country", val: user?.country as string },
  ];

  return (
    <Wrapper>
      <View className="flex-1">
        <View className="items-center space-y-4">
          {user && (
            <Avatar
              size="xl"
              name={user?.name as string}
              image={user?.avatar && getAvatar(user.avatar, user._id)}
            />
          )}
        </View>

        <View className="mt-7">
          {items.map((item) => (
            <ProfileItem
              key={item.name}
              name={item.name}
              value={item.val}
              action={() =>
                showEditItem({
                  ...item,
                  title: `Edit ${splitCamelCase(item.name)}`,
                })
              }
            />
          ))}
        </View>
      </View>
    </Wrapper>
  );
};

export default Profile;
