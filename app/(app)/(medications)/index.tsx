import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@/components/Core/Icon";
import { Drug, IconName } from "@/types/global";
import clsx from "clsx";
import Back from "@/components/Core/Back";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import EmptyPlan from "@/components/Health/Empty/EmptyPlan";

const Item = ({ drug }: { drug: Drug }) => {
  return (
    <View
      className={" bg-white rounded-[20px] p-3 mb-2 shadow-sm items-center  "}
    >
      <View className="flex-row justify-between space-x-4 items-center">
        <View
          className={clsx([
            "h-10 w-10 items-center justify-center rounded-full",
            "bg-blue-100",
          ])}
        >
          <Icon name={drug.type as IconName} />
        </View>
        <View className="flex-1">
          <Text className="font-main text-neutral-400 text-sm font-semibold capitalize">
            {drug.type}
          </Text>
          <Text className="font-main text-base font-semibold">{drug.name}</Text>
        </View>
        <View>
          <Text className="font-fwbold text-blue-500 text-capitalize   text-sm capitalize">
            Today, <Text className="uppercase">{drug.times[0]}</Text>
          </Text>
          <View className="flex-row justify-between items-center">
            {!!drug.notes && (
              <Text className="font-main text-neutral-400 font-semibold text-sm">
                1 note
              </Text>
            )}
            <Icon name="push-pin" />
          </View>
        </View>
      </View>
    </View>
  );
};

const Medications = () => {
  const { navigate } = useRouter();

  const fetchDrugs = async () => {
    const { data } = await axiosInstance.get("/drugs");
    return data;
  };

  const { data: drugs, isLoading } = useSWR("/medications", fetchDrugs);
  return (
    <SafeAreaView className="px-4 bg-gray-200  flex-1">
      <View className="space-y-4">
        <View className="flex-row items-center justify-between space-x-4">
          <Back />
          <TouchableOpacity onPress={() => navigate("/add")}>
            <Text className="font-main text-base text-blue-500 font-semibold">
              Add Medication
            </Text>
          </TouchableOpacity>
        </View>
        <Text className=" text-3xl font-fwbold">
          All Medications{" "}
          <Text className=" text-neutral-400">{drugs?.length}</Text>
        </Text>

        {isLoading ? (
          <View className="justify-center items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={EmptyPlan}
            data={drugs}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Item drug={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Medications;
