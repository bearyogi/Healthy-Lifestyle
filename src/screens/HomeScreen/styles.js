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
    historyButton: {
        backgroundColor: '#bdfbff',
        height: 70,
        alignSelf: "center",
        width: '91%',
        borderRadius: 5,
    },
    dailyProgress: {
        backgroundColor: '#f5ffe3',
        borderRadius: 11,
        borderWidth: 3,
        borderColor: '#b9e38f',
        padding: 15,
        marginBottom: 15
    },
    progressBar: {
        height: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#898b8c'
    },
    press: {
        width: '92%',
        alignSelf: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#3a7ef2',
        borderRadius: 11
    },
    press1: {
        width: '92%',
        height: '20%',
        alignSelf: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#a165c9',
        borderRadius: 11
    },
    press2: {
        width: '92%',
        height: '20%',
        alignSelf: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#c44f4b',
        borderRadius: 11
    },

    press3: {
        width: '92%',
        height: '20%',
        alignSelf: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#749ded',
        borderRadius: 11
    },
    press4: {
        width: '92%',
        height: '20%',
        alignSelf: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#19b5a1',
        borderRadius: 11
    },
    press5: {
        width: '92%',
        alignSelf: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#ffb975',
        borderRadius: 11
    },
    headingUser: {
        borderBottomWidth: 4,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        width: '90%',
        alignSelf : 'center',
        borderBottomColor: '#000'
    }

})