import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
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
    distanceContainer: {
        flex: 0.25,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderTopWidth: 2,
        borderTopColor: '#3da144'
    },
    categoryButton: {
        borderRadius: 15,
        marginTop: 10,
        width: '100%',
        height: 60,
        backgroundColor: '#8ab7ff'
    },
    categoryEmployee: {
        borderWidth: 2,
        borderRadius: 15,
        marginBottom: 10,
        width: '80%',
        height: '55%',
        alignSelf: 'center',
        backgroundColor: '#8ab7ff'
    },
    categoryText: {
        paddingTop: 18,
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 15,
        color: '#fff'
    },
    employeeText: {
        paddingTop: 18,
        marginBottom: 10,
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 20,
        color: '#000',
        fontWeight: "bold"
    },
    employeeTextAdd: {
        marginTop: 50,
        paddingTop: 18,
        marginBottom: 3,
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 20,
        color: '#000',
        fontWeight: "bold"
    },
    employeeCategoryText: {
        paddingTop: 10,
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 17,
        color: '#fff',
        fontWeight: "bold"
    },

    hello: {
        textAlign: "center",
        fontSize: 17,
        marginBottom: 10,
        marginTop: 35
    },
    textTrainingTime: {
        textAlign: "center",
        marginTop: 22,
        fontSize: 50,
        fontWeight: 'bold',
    },
    textTrainingDistance: {
        marginTop: 25,
        marginLeft: '15%',
        fontSize: 30,
        fontWeight: 'bold',
    },

    textTrainingCalories: {
        marginTop: 25,
        marginLeft: '14%',
        textAlign: "right",
        fontSize: 30,
        fontWeight: 'bold',
    },

    textTrainingSmallTime: {
        color: '#878787',
        fontSize: 15,
        textAlign: "center",
        fontWeight: 'bold',
    },
    textTrainingSmallDistance: {
        color: '#878787',
        marginTop: '-8%',
        marginLeft: '16%',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textTrainingSmallCalorie: {
        color: '#878787',
        marginTop: '-8%',
        marginLeft: '42%',
        textAlign: "right",
        fontSize: 15,
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    stopIcon: {
        marginTop: 0,
        marginLeft: '7%'
    },
    startButton: {
      width: '30%',
      alignSelf: "center"
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
        fontSize: 20,
        marginBottom: 7,
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
    editButton: {
        marginLeft: 40,
        alignSelf: 'center',
        marginTop: 2,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#2e803e',
        backgroundColor: "#5ee078",
        width: '30%',
        height: '100%',
    },
    deleteButton: {
        alignSelf: 'center',
        marginLeft: '19%',
        marginTop: 2,
        backgroundColor: "#f5342f",
        marginBottom: 10,
        width: '30%',
        height: '100%',
        borderWidth: 2,
        borderColor: '#b52626',
    },
    addButton: {
        alignSelf: 'center',
        marginTop: 12,
        backgroundColor: "#80e0d9",
        width: '90%',
        height: 70,
        borderWidth: 2,
        borderColor: '#4fb8b0',
        borderRadius: 30,
    },
    addButtonText: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#fff'
    }
})