import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from "react-native";

interface FavParmaciesProps {
    image: ImageSourcePropType;
    name: string;
    address: string;
}

const FavParmacies: React.FC<FavParmaciesProps> = ({ image, name, address }) => {

    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
    }

    return (
        <View className="flex-row items-center bg-[#82e0bf] my-2  rounded-[16px] h-[125px] p-3">
            <View className="flex-row justify-center items-center w-[45px] h-[45px] bg-[#0EBE7F] rounded-full mr-3 ">
                {/* <Ionicons name="person-outline" color="white" size={24} /> */}
                <Image source={image} style={{ width: 24, height: 24 }} />
            </View>
            <View className="flex-row justify-between bg-[#F5F5F5] h-[100px] rounded-[12px] w-[298px] p-3">
                <View className="flex-col justify-center ">
                    <Text className="text-[20px] font-bold color-[#0EBE7F]">{name}</Text>
                    <Text className="text-[16px]">{address}</Text>
                </View>
                <TouchableOpacity onPress={handleFavorite} className="flex-row justify-center items-center w-[40px] h-[40px]  bg-[#0EBE7F] rounded-full">
                    <View>
                        <Ionicons name={isFavorite ? "heart" : "heart-outline"} color="white" size={24} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default FavParmacies;   