import React from "react";
import lighthouse from '@lighthouse-web3/sdk';
import lit from "./lit";
import { useState } from "react";

function App() {

  const [file, setFile] = useState(null);
  const [encryptedUrlArr, setEncryptedUrlArr] = useState([]);
  const [encryptedKeyArr, setEncryptedKeyArr] = useState([]);
  const [decryptedFileArr, setDecryptedFileArr] = useState([]);


  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };


  function decrypt() {
    if (encryptedUrlArr.length !== 0) {
      Promise.all(encryptedUrlArr.map((url, idx) => {
        return lit.decryptString(url, encryptedKeyArr[idx]);
      })).then((values) => {
        setDecryptedFileArr(values.map((v) => {
          return v.decryptedFile;
        }));
      });
    }
  }

  const uploadFile = async(file) =>{
    // Push file to lighthouse node
    // Both file and folder are supported by upload function
    // Third parameter is for multiple files, if multiple files are to be uploaded at once make it true
    // Fourth parameter is the deal parameters, default null
    const output = await lighthouse.upload(file, "4aa380d2.3937eba670f9408db269d6f2915c797b", false, null, progressCallback);
    console.log('File Status:', output);
    /*
      output:
        data: {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */

      console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash);
      const url = `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`;

      const encrypted = await lit.encryptString(url);
      console.log('IPFS URL: ', url);
      console.log('Encrypted String: ', encrypted.encryptedFile);

      setEncryptedUrlArr((prev) => [...prev, encrypted.encryptedFile]);
      setEncryptedKeyArr((prev) => [...prev, encrypted.encryptedSymmetricKey]);
  }

  // async function handleSubmit(e) {
  //   e.preventDefault();

  //   try {
  //     const created = await uploadFile(file);
  //     // const url = `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`;

  //     const encrypted = await lit.encryptString(url);
  //     console.log('IPFS URL: ', url);
  //     console.log('Encrypted String: ', encrypted.encryptedFile);

  //     setEncryptedUrlArr((prev) => [...prev, encrypted.encryptedFile]);
  //     setEncryptedKeyArr((prev) => [...prev, encrypted.encryptedSymmetricKey]);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  return (
    // <div className="App">
    //   <input onChange={e=>uploadFile(e.target.files)} type="file" />
    // </div>

    <div className="main">
        <form>
          <input onChange={e=>uploadFile(e.target.files)} type="file" />
          <button type="submit" className="button">Submit</button>
        </form>
    </div>
      // <div>
      //   <button className="button" onClick={decrypt}>Decrypt</button>
      //   <div className="display">
      //     {decryptedFileArr.length !== 0
      //       ? decryptedFileArr.map((el) => <img src={el} alt="nfts" />) : <h3>Upload data, please! </h3>}
      //   </div>
      // </div>
  );
}

export default App;