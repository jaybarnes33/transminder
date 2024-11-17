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
import useSWR, { mutate } from "swr";
import EmptyPlan from "@/components/Health/Empty/EmptyPlan";
import { useBottomSheetModal } from "@/context/BottomSheet";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { format, formatDate } from "date-fns";
import { useState } from "react";
import { formatDrugTimes } from "@/utils";
import DatePicker from "@/components/Core/DatePicker";

export const DrugDetail = ({ drug }: { drug: Drug }) => {
  const { navigate } = useRouter();
  const { dismissModal } = useBottomSheetModal();
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const editDrug = () => {
    navigate({
      pathname: "/(app)/(medications)/add",
      params: {
        id: drug._id,
      },
    });

    dismissModal();
  };

  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [ending, setEnding] = useState(false);

  const deleteDrug = async () => {
    if (!confirm) {
      setConfirm(true);
    } else {
      try {
        setDeleting(true);
        await axiosInstance.delete(`/drugs/${drug._id}`);
        dismissModal();
        mutate("/medications");
        mutate("/medications?size");
        mutate("/drugs/intake");
        mutate(`/drug/${drug._id}`);
        navigate("/(app)/(medications)");
      } catch (error) {
        //@ts-ignore
        alert(error.response.data.error ?? `Failed to delete ${drug.name}`);
      } finally {
        setDeleting(false);
        setConfirm(false);
      }
    }
  };

  const endDrug = async () => {
    if (!date) {
      setShowDatePicker(true);
      return;
    }
    try {
      setEnding(true);
      await axiosInstance.put(`/drugs/${drug._id}`, { endDate: date });
      dismissModal();
      mutate("/medications");
      mutate("/medications?size");
      mutate("/drugs/intake");
      mutate(`/drug/${drug._id}`);
      navigate("/(app)/(medications)");
    } catch (error) {
      //@ts-ignore
      alert(error.response.data.error ?? `Failed to end ${drug.name}`);
    } finally {
      setEnding(false);
      setConfirm(false);
    }
  };

  return (
    <View className="h-full">
      <View className="relative z-0  h-[20vh]">
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor="#d7f3ff" />
              <Stop offset="1" stopColor="#f9fafb" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" rx={15} height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      <View className="absolute p-4 mt-[3vh] w-full">
        <View className="items-center gap-y-2">
          <View className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center">
            <Icon name={`${drug.type}-active` as IconName} />
          </View>
          <Text className="font-fwbold text-xl text-dark">{drug.name}</Text>
          <Text className="text-blue-500 text-base font-semibold">
            {formatDrugTimes(
              drug.times,
              drug.start,
              drug.schedule.repeat,
              drug.schedule.frequency!
            )}
          </Text>
        </View>
        <View className="mt-4  bg-white p-4 gap-y-3 rounded-[20px] shadow">
          <View className="flex-row justify-between border-b border-gray-300 pb-2">
            <Text className="font-semibold text-gray-400">Form</Text>
            <Text className="font-semibold text-dark capitalize">
              {drug.type}
            </Text>
          </View>
          <View className="flex-row justify-between border-b border-gray-300 pb-2">
            <Text className="font-semibold text-gray-400">Dosage</Text>
            <Text className="font-semibold text-dark capitalize">
              {drug.dosage}
            </Text>
          </View>
          {!!drug.notes && (
            <View className="flex-col justify-between  border-gray-300  gap-y-1 pb-2">
              <Text className="font-semibold text-gray-400">
                <Icon name="push-pin" /> Note Added
              </Text>
              <Text className="font-semibold text-dark ">{drug.notes}</Text>
            </View>
          )}
          <View className="flex-row items-center justify-between  border-gray-300  gap-y-1 pb-2">
            {showDatePicker ? (
              <DatePicker
                label="End Date"
                value={new Date(date.length ? date : new Date()).toISOString()}
                isEdit
                handleChange={setDate}
              />
            ) : (
              <Text className=" font-semibold">
                {drug.endDate ? format(drug.endDate, "PPP") : "N/A"}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={endDrug}
          className="items-center px-5 py-1 w-1/4 my-2 justify-center ml-auto bg-blue-500 flex-row rounded-full"
        >
          <Text className="text-base font-semibold text-white">End</Text>
          {ending && <ActivityIndicator color={"white"} />}
        </TouchableOpacity>
      </View>
      <View className="absolute items-center w-full gap-y-2 bottom-20">
        <TouchableOpacity
          onPress={editDrug}
          className="items-center px-5 rounded-full py-1 bg-gray-200 "
        >
          <Text className="text-base font-semibold">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteDrug}
          className="items-center px-5 py-1 bg-red-100 flex-row rounded-full"
        >
          <Text className="text-base font-semibold text-red-500">Delete</Text>
          {deleting && <ActivityIndicator color={"white"} />}
        </TouchableOpacity>

        {confirm && (
          <Text className="text-red-500 font-semibold text-base">
            Deleting is irreversible, Press the delete button again to confirm
          </Text>
        )}

        <Text className="font-semibold text-gray-400">
          Added on {formatDate(drug.createdAt, "MMMM dd, yyyy")}
        </Text>
      </View>
    </View>
  );
};
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
        <View className="w-2/5">
          <Text className="font-fwbold text-blue-500 text-sm ">
            <Text>
              {formatDrugTimes(
                drug.times,
                drug.start,
                drug.schedule.repeat,
                drug.schedule.frequency!
              )}
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

const Medications = () => {
  const { navigate, replace } = useRouter();

  const fetchDrugs = async () => {
    const { data } = await axiosInstance.get("/drugs");
    console.log({ data: data[0].schedule });
    return data;
  };

  const { data: drugs, isLoading } = useSWR("/medications", fetchDrugs);
  return (
    <SafeAreaView className="px-4 bg-gray-200  flex-1">
      <View className="gap-y-4">
        <View className="flex-row items-center justify-between gap-x-4">
          <Back action={() => navigate("/(tabs)/")} />
          <TouchableOpacity onPress={() => replace("/(app)/(medications)/add")}>
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
            keyExtractor={(item, index) => `${item._id}-${index}`}
            renderItem={({ item }) => <Item drug={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Medications;
