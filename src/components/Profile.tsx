import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "../styles/Color.styles";
import { hScale, vScale } from "../styles/Scale.styles";



type ProfileProps = {
    name: string;
    image: any;
    id: string;
}

const Profile = ({ name, image, id }: ProfileProps) => {
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.id}>{id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width:hScale(124),
        height:vScale(205),
        alignItems:'center',
        justifyContent:'center',
    },
    image:{
        width:hScale(124),
        height:vScale(124),
        borderRadius:hScale(124),
    },
    name: {
        fontSize:hScale(36),
        fontWeight:'bold',
        color:Colors.black,
    },
    id: {
        fontSize:hScale(16),
        color:Colors.black,
    },
});

export default Profile;