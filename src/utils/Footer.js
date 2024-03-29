import {Box, Center, HStack, Icon, Text} from "native-base";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import {AntDesign, FontAwesome5, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import React from "react";
import {firebase} from "../firebase/config";
 function Footer(props){
    const [selected, setSelected] = React.useState(props.choice);
    const { t } = useTranslation();

    const route = (text) => {
        setFirstLogon().then(Promise.resolve)
        const user = props.user;
        props.navigation.push(text, {user});
    }

     const setFirstLogon = async () => {
         const date = new Date();
         const dateYMD = date.getFullYear() + "-" + (date.getMonth() + 1)+ "-" + date.getDate();
         let id;
         const snap2 = firebase.firestore().collection('userDailyTrainingData');
         snap2.get().then((querySnapshot) => {
             querySnapshot.forEach((doc) => {
                 if(doc.data().userId === props.user.id && doc.data().date === dateYMD){
                     id = doc.id;
                     firebase.firestore().collection('userDailyTrainingData').doc(id).update({
                         firstLogon: 0
                     })
                 }}
             )

         })
     }

    return(
        <Box justifyContent="space-between" height="50" marginBottom="1" bg="white" >
            <Center flex={1}>
            </Center>

            <HStack bg='green.500' alignItems="center" paddingTop={3} paddingBottom={2} safeAreaBottom shadow={6} borderTopWidth={2} borderTopColor={'#1b7536'} borderTopRadius={2}>
                <Pressable
                    cursor="pointer"
                    opacity={selected === 0 ? 1 : 0.5}
                    py={2}
                    flex={1}
                    onPress={() => {
                        setSelected(0);
                        route('Home')
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
                        route('Map')
                    }}
                >
                    <Center>
                        <Icon
                            mb={1}
                            as={<MaterialIcons name="location-pin"/>}
                            color="white"
                            size="xs"
                        />

                        <Text color="white" fontSize={14}>{props.user.permissionLevel === 1 ?  t('categories') : t('startTraining')}</Text>
                    </Center>
                </Pressable>
                <Pressable
                    cursor="pointer"
                    opacity={selected === 2 ? 1 : 0.5}
                    py={2}
                    flex={1}
                    onPress={() => {
                        setSelected(2)
                        route('Training')
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
                        route('Diet')
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
                        route('Profile')
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
