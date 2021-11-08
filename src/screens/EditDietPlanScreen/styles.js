import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(21, 153, 40, .0001)',
        borderWidth: 6,
        borderRadius: 35,
        borderColor: 'rgba(21, 153, 40, .5)'
    },
    title: {

    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
    },
    input: {
        height: 48,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
        borderWidth: 2,
        borderColor: '#2eab47',
        color: '#5a9967'
    },
    button: {
        backgroundColor: '#2eab47',
        marginLeft: 30,
        marginRight: 30,
        marginTop: '20%',
        height: 48,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#2eab47",
        fontWeight: "bold",
        fontSize: 16
    },
    helloText: {
        fontSize: 50,
        marginLeft: '8%',
        color: '#2eab47',
        alignSelf: 'center',
        fontFamily: 'monospace',
        fontWeight: "bold",
        marginBottom: '13%',
    },
    formControl: {
        width: '95%',
        alignSelf: 'center',
        marginTop: 15,
        borderWidth: 2,
        borderColor: 'rgba(21, 153, 40, .2)'
    },
    formControlLabel: {
        height: '300'

    },
    buttonReturn: {
        backgroundColor: '#2088e3',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: 'center'
    },
    hexColor: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: 'rgba(21, 153, 40, .2)',
        width: '95%',
        padding: 10,
        marginTop: 15,
        alignSelf: 'center',
        borderRadius: 10
    }
})