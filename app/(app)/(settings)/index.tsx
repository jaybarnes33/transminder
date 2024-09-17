import { View, Text, FlatList, TouchableOpacity } from "react-native";

import Back from "@/components/Core/Back";
import { useUser as useCachedUser, useUser } from "@/context/Auth";
import Icon from "@/components/Core/Icon";
import Avatar from "@/components/Core/Avatar";
import { Feather } from "@expo/vector-icons";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";

import Wrapper from "@/components/Settings/Wrapper";
import { getAvatar } from "@/utils/auth";

const Profile = () => {
  const { user, loading, logOut } = useUser();
  const sections = {
    personalize: [
      {
        name: "profile",
        icon: "user",
        path: "profile",
      },
    ],

    preferences: [
      {
        name: "manage account",
        icon: "lock",
        path: "account",
      },
      {
        name: "manage subscription",
        icon: "card",
        path: "(subscription)",
      },
      {
        name: "notifications",
        icon: "bell",
        path: "notifications",
      },
      {
        name: "language",
        icon: "language",
        path: "language",
      },
    ],
    support: [
      {
        name: "report a place, content or bug",
        icon: "report",
        path: "report",
      },
      {
        name: "contact us",
        icon: "contact",
        path: "contact",
      },
      {
        name: "about transminder",
        icon: "info",
        path: "about",
      },
    ],
  };

  const { navigate } = useRouter();

  return (
    <Wrapper>
      {user && (
        <View className="items-center space-y-1">
          <Avatar
            size="xl"
            name={user?.name as string}
            image={user.avatar && getAvatar(user.avatar, user._id)}
            isEdit={false}
          />
          <Text className="font-fwbold text-[30] ">
            {user?.name.split(" ")[0]}
          </Text>
          <TouchableOpacity onPress={logOut}>
            <Text className=" font-base font-fwbold text-red-500">Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={Object.keys(sections)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="space-y-1 my-3" key={item}>
            <Text className="font-main text-base text-neutral-500 font-semibold capitalize">
              {item}
            </Text>
            {sections[item as keyof typeof sections].map((section) => (
              <TouchableOpacity
                onPress={() =>
                  navigate({
                    //@ts-ignore
                    pathname: section.path,
                    params: { title: section.name },
                  })
                }
                className="flex-row items-center space-x-3 bg-neutral-200 h-[50] px-4 rounded-xl "
                key={section.name}
              >
                <Icon name={section.icon as keyof typeof icons} />
                <Text className="font-main text-base flex-1 font-semibold text-neutral-700 capitalize">
                  {section.name}
                </Text>

                <Feather name="chevron-right" size={20} color={"gray"} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </Wrapper>
  );
};

export default Profile;
