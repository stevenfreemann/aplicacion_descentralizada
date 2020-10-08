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
    mapping(string => bool) public tokens;
    //almacenamiento correos institucionales
    mapping(uint => string) public correos;
    //almacenamiento de candidatos
    mapping(uint => candidato) public candidatos;
    //Inicializa los candidatos
    constructor () public {
        agregarCandidato("blanco",
        "images/voto-blanco.jpeg",
        "Voto que no esta dirigido para ningun candidato");
    }
    function agregarCandidato (string memory _nombre,string memory _url,string memory _info) public {
        numero_candidatos++;
        candidatos[numero_candidatos] = candidato(numero_candidatos, _nombre, 0,_url,_info);
    }
    event votoEvent (
        uint indexed _idCandidato
    );
    function votar (uint _idCandidato, string memory _token) public {
        require(tokens[_token],"Token no valido");
        require(_idCandidato > 0 && _idCandidato <= numero_candidatos,"candidato no valido");
        tokens[_token] = false;
        candidatos[_idCandidato].cantidad_votos ++;
        emit votoEvent(_idCandidato);
    }
    function votarTest (uint _idCandidato) public {
        require(_idCandidato > 0 && _idCandidato <= numero_candidatos,"candidato no valido");
        candidatos[_idCandidato].cantidad_votos ++;
        emit votoEvent(_idCandidato);
    }
    function solicitudKey (string memory _correo, string memory _token) public {
        for(uint i=1;i<=numero_correos;i++){
            if(keccak256(bytes(correos[i])) == keccak256(bytes(_correo))){
                revert("Este correo ya existe");
            }
        }
        numero_correos++;
        correos[numero_correos]=_correo;
        tokens[_token] = true;
    }
}