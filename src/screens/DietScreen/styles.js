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
    sectionList: {
        backgroundColor: '#fff'
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
        fontSize: 22,
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

})