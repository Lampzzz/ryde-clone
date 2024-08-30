import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";

import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

interface SearchResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
}

const NominatimSearchInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const searchLocations = async (text: string) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: text,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      <View className="flex-1 flex-row items-center bg-white rounded-lg">
        <TouchableOpacity onPress={() => router.push("/(root)/find-ride")}>
          <View className="justify-center items-center w-6 h-6">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <TextInput
          style={{
            backgroundColor: textInputBackgroundColor || "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
            paddingHorizontal: 15,
          }}
          placeholder={initialLocation ?? "Where do you want to go?"}
          placeholderTextColor="gray"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            searchLocations(text);
          }}
        />
      </View>
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handlePress({
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.lon),
                  address: item.display_name,
                });
                setResults([]);
                setQuery(item.display_name);
              }}
            >
              <Text className="p-3 bg-white">{item.display_name}</Text>
            </TouchableOpacity>
          )}
          style={{
            position: "absolute",
            top: 60,
            width: "100%",
            backgroundColor: "white",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          }}
        />
      )}
    </View>
  );
};

export default NominatimSearchInput;
