import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Drug, IconName, Intake } from "@/types/global";
import Icon from "../Core/Icon";
import { FlatList } from "react-native-gesture-handler";
import clsx from "clsx";
import Heading from "../Core/Heading";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import useSWR, { mutate } from "swr";
import EmptyPlan from "./Empty/EmptyPlan";
import { differenceInMinutes, format } from "date-fns";
import { formatDrugTimes, getDrugStatus } from "@/utils";
import { icons } from "@/constants/icons";
import { useBottomSheetModal } from "@/context/BottomSheet";
import { DrugDetail } from "@/app/(app)/(medications)";

const Item = ({ drug }: { drug: Drug }) => {
  const { showModal } = useBottomSheetModal();

  const viewDetails = () => {
    showModal(<DrugDetail drug={drug} />);
  };
  return (
    <TouchableOpacity
      key={`${drug._id}`}
      onPress={viewDetails}
      className={" bg-white rounded-[20px] p-3 mb-2 shadow-sm items-center  "}
    >
      <View className="flex-row justify-between space-x-4 items-center">
        <View className="flex-row flex-1 space-x-2">
          <View
            className={clsx([
              "h-10 w-10 items-center justify-center rounded-full",
              "bg-blue-100",
            ])}
          >
            <Icon name={drug.type as IconName} />
          </View>
          <View>
            <Text className="font-main text-neutral-400 text-sm font-semibold capitalize">
              {drug.type}
            </Text>
            <Text className="font-main text-base font-semibold">
              {drug.name}
            </Text>
          </View>
        </View>
        <View>
          <Text className="font-fwbold text-blue-500 text-sm ">
            <Text>
              {
                formatDrugTimes(
                  drug.times,
                  drug.start,
                  drug.schedule.repeat
                ).split("at")[0]
              }
            </Text>
          </Text>
          {!!drug.notes && (
            <View className="flex-row justify-end items-center">
              <Text className="font-main mr-1 text-neutral-400 font-semibold text-sm">
                1 note
              </Text>
              <Icon name="push-pin" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
const UpcomingDrugs = () => {
  const { navigate } = useRouter();

  const fetchDrugs = async () => {
    const { data } = await axiosInstance.get("/drugs/upcoming/?size=5");

    return data;
  };

  const { data: drugs, isLoading } = useSWR("/drugs/upcoming", fetchDrugs);
  return (
    <View className="space-y-1">
      <View className="flex-row items-center justify-between space-x-2">
        <Heading
          text="Upcoming drugs"
          more="View meds"
          moreAction={() => navigate("/(medications)")}
        />
      </View>
      <View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={drugs}
            ListEmptyComponent={<EmptyPlan />}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Item drug={{ ...item }} />}
          />
        )}
      </View>
    </View>
  );
};

export default UpcomingDrugs;
