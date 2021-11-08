import {Box, Center, HStack, Icon, Text} from "native-base";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import * as RootNavigation from './RootNavigation';
import {AntDesign, FontAwesome5, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import React from "react";
 function Footer(props){
    const [selected, setSelected] = React.useState(props.choice);
    const { t } = useTranslation();
    return(
        <Box justifyContent="space-between" height="50" marginBottom="1" bg="white" >
            <Center flex={1}>
            </Center>

            <HStack bg='green.500' alignItems="center" paddingTop={3} paddingBottom={2} safeAreaBottom shadow={6}>
                <Pressable
                    cursor="pointer"
                    opacity={selected === 0 ? 1 : 0.5}
                    py={2}
                    flex={1}
                    onPress={() => {
                        setSelected(0);
                        RootNavigation.navigate("Home", {'user' : props.user})
                    }}
                >
                    <Center>
                        <Icon
                            mb={1}
                            as={<MaterialCommunityIcons name="heart"/>}
                            color="white"
                            size="xs"
                        />

                        <Text color="white" fontSize={14}>{t('mainMenu')}</Text>
                    </Center>
                </Pressable>
                <Pressable
                    cursor="pointer"
                    opacity={selected === 1 ? 1 : 0.5}
                    py={2}
                    flex={1}
                    onPress={() => {
                        setSelected(1)
                        RootNavigation.navigate('Map', {user: props.user})
                    }}
                >
                    <Center>
                        <Icon
                            mb={1}
                            as={<MaterialIcons name="location-pin"/>}
                            color="white"
                            size="xs"
                        />

                        <Text color="white" fontSize={14}>{t('startTraining')}</Text>
                    </Center>
                </Pressable>
                <Pressable
                    cursor="pointer"
                    opacity={selected === 2 ? 1 : 0.5}
                    py={2}
                    flex={1}
                    onPress={() => {
                        setSelected(2)
                        RootNavigation.navigate('Training', {user: props.user})
                    }}
                >
                    <Center>
                        <Icon
                            mb={1}
                            as={<FontAwesome5 name="weight-hanging"/>}
                            color="white"
                            size="xs"
                        />

                        <Text color="white" fontSize={14}> {t('trainList')}</Text>
                    </Center>
                </Pressable>
                <Pressable
                    cursor="pointer"
                    opacity={selected === 3 ? 1 : 0.5}
                    py={2}
                    flex={1}
                    onPress={() => {
                        setSelected(3)
                        RootNavigation.navigate('Diet', {user: props.user})
                    }}
                >
                    <Center>
                        <Icon
                            mb={1}
                            as={<MaterialCommunityIcons name="food-apple"/>}
                            color="white"
                            size="xs"
                        />
                        <Text color="white" fontSize={14}>{t('diet')}</Text>
                    </Center>
                </Pressable>
                <Pressable
                    cursor="pointer"
                    opacity={selected === 4 ? 1 : 0.5}
                    py={2}
                    flex={1}
                    onPress={() => {
                        setSelected(4)
                        RootNavigation.navigate('Profile', {user: props.user})
                    }}
                >
                    <Center>
                        <Icon
                            mb={1}
                            as={<AntDesign name="profile"/>}
                            color="white"
                            size="xs"
                        />
                        <Text color="white" fontSize={14}>{t('profile')}</Text>
                    </Center>
                </Pressable>
            </HStack>
        </Box>
    )
}
export default Footer;
