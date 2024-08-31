import { useState } from "react";
import { router } from "expo-router";
import axios from "axios";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";

import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

interface SearchResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
}

const SearchPlace = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // console.log(`Results: ${JSON.stringify(results, null, 2)}`);

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
      className={`flex flex-row items-center justify-center relative z-50 rounded-full p-3 ${containerStyle}`}
    >
      <View className="flex-1 flex-row items-center ">
        <View className="justify-center items-center w-6 h-6">
          <Image
            source={icon ? icon : icons.search}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </View>
        <TextInput
          className={`px-3 text-base ${textInputBackgroundColor || "white"}`}
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
            top: "200%",
            width: "100%",
            backgroundColor: "white",
            borderRadius: 20,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          }}
        />
      )}
    </View>
  );
};

export default SearchPlace;
