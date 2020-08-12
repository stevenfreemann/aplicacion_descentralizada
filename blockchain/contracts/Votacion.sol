pragma solidity ^0.5.16;

contract Votacion{
    //objeto Candidato
    struct candidato{
        uint id;
        string nombre;
        uint cantidad_votos;
        string url;
        string info;
    }
    //numero de correos
    uint public numero_correos;
    //numero de candidatos
    uint public numero_candidatos;
    //almacenamiento direcciones de los votantes
    mapping(address => bool) public votantes;
    //almacenamiento correos institucionales
    mapping(uint => string) public correos;
    //almacenamiento de candidatos
    mapping(uint => candidato) public candidatos;
    //Inicializa los candidatos
    constructor () public {
        agregarCandidato("Jorge gonzalez",
        "images/jorge_gonzalez.jpg",
        "Estudiante de psicologia-noveno semestre ext Facatativa-25 años");
        agregarCandidato("Luis bedolla",
        "images/luis_bedolla.jpg",
        "Estudiante de Administracion De Empresas-decimo semestre ext Facatativa-24 años");
    }
    function agregarCandidato (string memory _nombre,string memory _url,string memory _info) private {
        numero_candidatos++;
        candidatos[numero_candidatos] = candidato(numero_candidatos, _nombre, 0,_url,_info);
    }

    event votoEvent (
        uint indexed _idCandidato
    );
    function votar (uint _idCandidato) public {
        //verifica 1 voto por cuenta
        require(!votantes[msg.sender],"Esa direccion de cuenta ya realizo el voto");

        //verifica candidato sea valido
        require(_idCandidato > 0 && _idCandidato <= numero_candidatos,"candidato no valido");

        // record that voter has voted
        votantes[msg.sender] = true;

        // update candidate vote Count
        candidatos[_idCandidato].cantidad_votos ++;

        // trigger voted event
        emit votoEvent(_idCandidato);
    }
    function solicitudKey (string memory _correo) public {
        for(uint i=1;i<=numero_correos;i++){
            if(keccak256(bytes(correos[i])) == keccak256(bytes(_correo))){
                revert("Este correo ya existe");
            }        
        }
        numero_correos++;
        correos[numero_correos]=_correo;
    }

}