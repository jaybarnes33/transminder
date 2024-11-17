import { View, Text, FlatList, TouchableOpacity, Linking } from "react-native";

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
  const sections: Record<
    "personalize" | "preferences" | "support",
    {
      name: string;
      icon: string;
      path?: string;
      url?: string;
    }[]
  > = {
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
        url: "mailto:report@transminder.app",
      },
      {
        name: "contact us",
        icon: "contact",
        url: "mailto:hello@transminder.app",
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
        <View className="items-center gap-y-1">
          <Avatar
            size="lg"
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
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="gap-y-1 my-1" key={item}>
            <Text className="font-main text-base mt-2 text-neutral-500 font-semibold capitalize">
              {item}
            </Text>
            {sections[item as keyof typeof sections].map((section) => (
              <TouchableOpacity
                onPress={async () =>
                  !section.url
                    ? navigate({
                        //@ts-ignore
                        pathname: section.path,
                        params: { title: section.name },
                      })
                    : (await Linking.canOpenURL(section.url)) &&
                      Linking.openURL(section.url)
                }
                className="flex-row items-center gap-x-3 bg-gray-200 h-[50] px-4 rounded-xl "
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
