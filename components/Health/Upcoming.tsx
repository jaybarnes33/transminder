import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Drug, IconName, Intake } from "@/types/global";
import Icon from "../Core/Icon";
import clsx from "clsx";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import useSWR, { mutate } from "swr";
import EmptyPlan from "./Empty/EmptyPlan";
import { formatRelative } from "date-fns";

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
      <View className="flex-row justify-between gap-x-4 items-center">
        <View className="flex-row flex-1 gap-x-2">
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
              {formatRelative(new Date(drug?.nextIntakeDate!), new Date())}
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
    <View className="gap-y-1">
      <View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          drugs.length > 0 && (
            <FlatList
              data={drugs}
              ListEmptyComponent={<EmptyPlan />}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <Item drug={{ ...item }} />}
            />
          )
        )}
      </View>
    </View>
  );
};

export default UpcomingDrugs;
