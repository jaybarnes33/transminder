import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Onboarding } from "@/types/global";
import clsx from "clsx";
import { colors } from "@/constants/onboarding";
import { useRouter } from "expo-router";
import UnAuthContent from "@/components/Auth/UnAuthContent";
import { onboardingCompleted } from "@/utils/auth";

const components: Record<number, Onboarding> = {
  0: {
    image: require("@/assets/images/onboarding/one.png"),
    subtitle: "Health",
    line1: "Your wellness,",
    line2: "under control",
    color: "rose",
    description:
      "Easily manage your medication, stay on top of your mental health, and track side effects—all to ensure you're always feeling your best.",
  },
  1: {
    image: require("@/assets/images/onboarding/two.png"),
    subtitle: "Insights",

    line1: "See your progress,",
    line2: "celebrate growth",
    color: "blue",
    description:
      "Visualize your journey with clear insights into your history. Understand your progress at a glance and stay motivated.",
  },
  2: {
    image: require("@/assets/images/onboarding/three.png"),
    subtitle: "Reports",
    line1: "Stay prepared,",
    line2: "stay confident",
    color: "orange",
    description:
      "Create PDF reports of your health entries. Take them to your doctor appointment, ensuring every detail is covered during your consultation.",
  },
  3: {
    image: require("@/assets/images/onboarding/four.png"),
    subtitle: "Map",
    line1: "Find support,",
    line2: "wherever you are",
    color: "purple",
    description:
      "Connect with health professionals, supportive communities, and safe spaces near you using our map.",
  },
  4: {
    image: require("@/assets/images/onboarding/five.png"),
    subtitle: "Resources",
    line1: "Knowledge is your,",
    line2: "superpower",
    color: "gold",
    description:
      "Access expert resources and insights to empower your journey, helping you make informed decisions every step of the way.",
  },
};

const OnboardingItem = ({
  image,
  subtitle,
  line1,
  line2,
  description,
  title,
}: Onboarding & {
  title: string;
}) => {
  return (
    <View className="flex-col items-center justify-between mt-4">
      <View className="my-2">
        <Image source={image} />
      </View>
      <View className="items-center mt-10 justify-center">
        <Text
          className={clsx(["text-sm text-center font-main font-normal", title])}
        >
          {subtitle}
        </Text>
        <View className="mt-2 mb-3">
          <Text className="text-2xl font-fwbold text-center">{line1}</Text>
          <Text className="text-2xl font-fwbold text-center">{line2}</Text>
        </View>
        <Text className=" text-center font-main">{description}</Text>
      </View>
    </View>
  );
};
const index = () => {
  const [step, setStep] = React.useState(0);
  const [onboarded, setOnboarded] = React.useState(false);
  const { navigate } = useRouter();
  const handleStep = () => {
    if (step === 4) {
      navigate("/Auth");
    } else {
      setStep((step) => step + 1);
    }
  };

  const [color, setColor] = React.useState<
    (typeof colors)[keyof typeof colors]
  >(colors["rose"]);

  useEffect(() => {
    setColor(colors[components[step].color]);
  }, [step]);

  useEffect(() => {
    async () => {
      const boarded = await onboardingCompleted();
      setOnboarded(boarded);
    };
  }, []);

  useEffect(() => {
    if (onboarded) {
      navigate("/Auth");
    }
  }, [onboarded]);
  return (
    <UnAuthContent>
      <SafeAreaView className={clsx(["flex-1  px-4", "bg-rose-50", color.bg])}>
        <View className="flex-1 items-center ">
          <View className="flex-row mt-5">
            {Object.keys(components).map((key) => {
              return (
                <TouchableOpacity
                  onPress={() => setStep(parseInt(key))}
                  key={key}
                  className={`h-2 w-2 rounded-full ${
                    step === parseInt(key)
                      ? `${color.active} w-4 h`
                      : `${color.inactive}`
                  } mx-1`}
                />
              );
            })}
          </View>

          <OnboardingItem {...components[step]} title={color.text} />
        </View>
        <View className="absolute bottom-10 w-screen px-4">
          <TouchableOpacity
            className="bg-dark py-4 items-center rounded-3xl"
            onPress={handleStep}
          >
            <Text className="text-white font-main font-semibold">
              {" "}
              {step === 4 ? "Get Started" : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </UnAuthContent>
  );
};

export default index;
