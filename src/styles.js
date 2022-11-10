import styled, { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
    }
    
    body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: 'Poppins', sans-serif;
    }
`

export const Container = styled.section`
    background-color: #212121;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;

    & > h2 { margin-bottom: 25px; text-transform: uppercase; color: white;}
`

export const Form = styled.form`
    display: flex;
    gap: 10px;
`;

export const Input = styled.input`
    height: 50px;
    border-radius: 10px;
    border: 0;
    background-color: #f0f0f0;
    padding: 0 10px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    outline: none;
`;

export const ButtonAddNumber = styled.button`
    border-radius: 10px;
    border: 0;
    background-color: rgba(102, 204, 255, 0.5);
    color: white;
    padding: 0 10px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    transition: all .5s;
    font-weight: 500;

    &:hover {
        background-color: rgba(102, 204, 255, 0.8);
    }
`

export const ButtonChangeLine = styled.button`
    border-radius: 10px;
    border: 0;
    background-color: rgba(102, 255, 102, 0.5);
    color: #fff;
    font-weight: 500;
    padding: 0 10px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    transition: all .5s;

    &:hover {
        background-color: rgba(102, 255, 102, 0.8);
    }
`

export const ButtonRun = styled.button`
    border-radius: 10px;
    border: 0;
    background-color: rgba(255, 0, 102, 0.6);
    color: white;
    padding: 0 10px;
    cursor: pointer;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    transition: all .5s;

    &:hover {
        background-color: rgba(255, 0, 102, 0.8);
    }
`

export const Table = styled.div`
    display: flex;
    width: 1000px;
    flex-direction: column;
    margin-bottom: 50px;
    gap: 10px;
`

export const Row = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    min-height: 50px;
`

export const Column = styled.div`
    background-color: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 10px;
    flex: 1;
    font-size: 20px;
    font-weight: bold;
    color: #fff;

    &.objetiva {
        background-color: rgba(255, 0, 102, 0.1);
    }

    &.menorvalor {
        background-color: rgba(102, 255, 102, 0.1);
    }

    &.linhapivo {
        background-color: rgba(102, 204, 255, 0.1);
    }

    &.pivomax {
        background-color: rgba(102, 255, 102, 0.1);
    }
`