import {createWriteStream} from "fs";
import axios, {AxiosError} from "axios";
import data from "./config.json" assert {type: "json"};

enum L10n {
  VI = "vi-VN",
  EN = "en-US",
  JP = "ja-JP"
}

export async function downloadFile(fileUrl: string, outputLocationPath: string) {
  const writer = createWriteStream(outputLocationPath);

  return axios.get(fileUrl, {
    responseType: 'stream'
  }).then(response => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error: Error | null = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  });
}

const BASE_URL = "https://api.soundoftext.com"

const axiosClient = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "PostmanRuntime/7.36.0",
    "Accept": "*/*",
    "Connection": "keep-alive",
    "Accept-Encoding": "gzip, deflate, br"
  },
  maxBodyLength: Infinity
})

async function getAudio(objectId: number, text: string, type: L10n) {
  type CreateResult = {
    success: boolean,
    id: string
  }
  try {
    const resultCreateAudio = await axiosClient.post<CreateResult>(`${BASE_URL}/sounds`, {
      engine: "Google",
      data: {
        text,
        voice: type
      }
    })
    const id = resultCreateAudio.data.id
    type GetResult = {
      location: string,
      status: string
    }
    const resultGetAudio = await axiosClient.get<GetResult>(`${BASE_URL}/sounds/${id}`,)
    const url = resultGetAudio.data.location
    await downloadFile(url, `output/${toName(objectId, type)}`)
  } catch (e) {
    if (e instanceof AxiosError) {
      throw `${e.message}: ${JSON.stringify(e.response?.data)}`
    } else {
      throw e
    }
  }
}

function toName(id: number, type: L10n) {
  switch (type) {
    case L10n.EN:
      return `${id}_en.mp3`;
    case L10n.JP:
      return `${id}_jp.mp3`;
    case L10n.VI:
      return `${id}_vi.mp3`;
  }
}

type Config = {
  index: number,
  id: string,
  english: string,
  vietnamese: string,
  japanese: string
}

let errorList: Config[] = data

async function main() {
  while (errorList.length > 0) {
    console.log("Item remains:", errorList.length)
    const tempErr: Config[] = []
    for (let i = 0; i < errorList.length; i++) {
      const currentItem = errorList[i]
      try {
        await Promise.all([
          getAudio(currentItem.index, currentItem.english, L10n.EN),
          getAudio(currentItem.index, currentItem.vietnamese, L10n.VI),
          getAudio(currentItem.index, currentItem.japanese, L10n.JP),
        ])
        console.log("Item done:", currentItem.english)
      } catch (e) {
        console.log("Item error:", currentItem.english)
        console.error(e)
        tempErr.push(currentItem)
        console.log("Sleep 1s...")
        await sleep(1000)
      } finally {
        await sleep(500)
      }
    }
    errorList = [...tempErr]
  }
  console.log("Done")
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

await main();


