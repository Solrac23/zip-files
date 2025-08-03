/**
 * @file src/app.ts
 * @description Main application file that initializes the server and handles file operations.
 * @license MIT
 * @author Carlos Eduardo
 * @version 1.0.0
 */

/** 
 * Primeiro preciso saber qual o sistema operacional que estou rodando,
 * e depois disso, preciso direcionar para o caminho correto que desejo acessar.
 * Obtendo o caminho correto, preciso informar se o caminho e no formato windows ou linux.
 * Se for windows, preciso usar a barra invertida, se for linux, preciso usar a barra normal.
 * Se for macOS, preciso usar a barra normal também.
 * Acessando o caminho correto, preciso verificar se o arquivo existe.
 * Se o arquivo existir, preciso ler o arquivo e verificar a ultima modificação.
 * Se a ultima modificação for menor que 3 meses, compactar os arquivo.
 * Se a ultima modificação for maior que 3 meses, não compactar os arquivos.
 */
import { ZipFileService } from './services/zip-files-service';