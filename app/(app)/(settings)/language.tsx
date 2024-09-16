import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Wrapper from "@/components/Settings/Wrapper";

const Language = () => {
  const languages = [
    { flag: "🇬🇧", name: "English" }, // Changed to UK flag
    { flag: "🇫🇷", name: "Français" },
    { flag: "🇩🇪", name: "Deutsch" },
    { flag: "🇪🇸", name: "Spanish" },
    { flag: "🇵🇹", name: "Portuguese" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages[0].name
  );

  return (
    <Wrapper>
      <View className="space-y-2 mt-4">
        <Text className="font-main text-base text-neutral-500 font-semibold">
          Select your language
        </Text>

        <View>
          {languages.map((lang, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedLanguage(lang.name)}
              className={`flex-row items-center space-x-3 h-[50] px-4 rounded-xl mb-1 ${
                selectedLanguage === lang.name
                  ? "bg-purple-300"
                  : "bg-neutral-200"
              }`}
            >
              <Text className="text-base capitalize text-neutral-700 font-semibold font-main">
                {lang.flag}
              </Text>
              <Text className="text-base text-dark font-main font-bold">
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Wrapper>
  );
};

export default Language;
