import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 40,
        marginBottom: 20,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },
    summaryText1: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        color: '#000',
        marginTop: 20,
        marginBottom: 30,
        marginLeft: 5
    },
    summaryText2: {
        fontSize: 12,
        marginBottom: 2,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 5
    },
    summaryText3: {
        fontSize: 30,
        marginBottom: 7,
        marginTop: 25,
        fontWeight: 'bold',
        color: '#000',
        textAlign: "center",
    },
    summaryText4: {
        fontSize: 20,
        color: '#000',
        textAlign: "center",
    },
    summaryModal: {
        width: '100%',
        height: '100%',
        backgroundColor: "#d0f7d8",
    },
    endButtonModal:{
        width: '100%',
        height: 80,
        backgroundColor: "#4bd65d"
    },
    trainingInfo: {
        marginTop: 10,
        width:'45%'
    },
    historyHeading: {
        backgroundColor: '#fff',
        textAlign: 'center',
        borderBottomWidth: 4,
        borderBottomColor: '#3ebd51',
        padding: 5,
        marginBottom: 10,
        paddingTop: 15
    },
    accordion: {
        margin: 0,
        height: 70,
        padding: 15,
        borderWidth: 1,
        borderColor: '#f0fcf1'
    }
})