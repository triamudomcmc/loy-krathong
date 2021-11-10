import type { NextPage } from "next";
import { useState } from "react";
import { Kratong } from "./kratong";
import { KratongMap, KratongMapType } from "@map/kratong";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import classnames from "classnames";

export interface Selected {
  base: string;
  flowers: string;
  candles: string;
  decorations: string;
  offset: number;
}

interface CreateKratongProps {
  selected: Selected;
  setSelected: (selection: Selected) => void;
  nextPage: () => void;
}

const CreateKratong: NextPage<CreateKratongProps> = ({ selected, setSelected, nextPage }) => {
  const [section, setSection] = useState<"base" | "flowers" | "candles" | "decorations">("base");

  const generate = (part: "base" | "flowers" | "candles" | "decorations") => {
    let parts: any[] = [];

    Object.values(KratongMap[part]).forEach((k, i) => {
      // @ts-ignore
      const data = k;
      const partLoc = Math.ceil((i + 1) / 3) - 1;
      parts[partLoc] = [
        ...(parts[partLoc] || []),
        <div
          key={`part_${k.id}`}
          onClick={() => {
            setSelected({ ...selected, [part]: data.id, offset: data.offset || 0 });
          }}
          className={classnames(
            "max-w-[8rem] max-h-[9rem] border-2 rounded-lg cursor-pointer bg-[#F5F5FB] transition-opacity bg-opacity-40 hover:bg-opacity-60",
            selected[part] === data.id ? "border-white" : "border-transparent"
          )}
        >
          <div className="flex flex-col items-center mt-[-4px] mx-[-6px]">
            <Image
              alt={k["name"]}
              priority={true}
              width={2388}
              height={1668}
              src={"url" in data ? data.url : data.variants[0]}
            />
            <span className="text-sm text-center py-2 px-2 text-[#726EA5]">{data.name}</span>
          </div>
        </div>,
      ];
    });

    return parts.map((d, i) => (
      <div key={`col-${i}`} className="flex margin-x-auto space-x-4">
        {d.map((g: Element) => g)}
      </div>
    ));
  };

  return (
    <div className="flex items-center fixed min-h-screen w-full top-0 z-20 px-10 font-ui">
      <div className="flex flex-col border border-white bg-white bg-opacity-20 backdrop-blur-lg h-[80vh] max-h-[650px] max-w-[525px] w-full mx-auto rounded-[34px]">
        <div className="h-full pt-8 pb-4 sm:pb-2 w-full">
          <h1 className="text-white text-2xl text-center mb-8">สร้างกระทง</h1>
          <div className="flex flex-col items-center">
            <div className="relative top-[-24px] sm:top-[-12px] mb-[-34px] sm:mb-[-30px]">
              <Kratong height="240px" offset="60px" selected={selected} />
            </div>
            <svg className="w-[240px]" viewBox="0 0 370 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse
                cx="184.709"
                cy="20"
                rx="184.5"
                ry="20"
                fill="white"
                fillOpacity="0.3"
                style={{ mixBlendMode: "soft-light" }}
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col relative z-10 justify-between border border-white bg-white bg-opacity-40 h-full rounded-[34px] w-full pb-4">
          <div className="space-y-6">
            <div className="flex justify-center w-full mb-4 py-2 px-4 space-x-4 sm:space-x-6 rounded-t-[34px] bg-white bg-opacity-40">
              <button
                onClick={() => {
                  setSection("base");
                }}
                className={classnames(
                  "px-3 sm:px-8 py-2 rounded-full font-light text-sm transition-colors",
                  section === "base"
                    ? "bg-[#2256A3] text-white shadow-lg"
                    : "bg-transparent text-[#2256A3] hover:text-[#0d264c]"
                )}
              >
                ฐาน
              </button>
              <button
                onClick={() => {
                  setSection("flowers");
                }}
                className={classnames(
                  "px-2 sm:px-4 py-2 rounded-full font-light text-sm transition-colors",
                  section === "flowers"
                    ? "bg-[#2256A3] text-white shadow-lg"
                    : "bg-transparent text-[#2256A3] hover:text-[#0d264c]"
                )}
              >
                ดอกไม้
              </button>
              <button
                onClick={() => {
                  setSection("decorations");
                }}
                className={classnames(
                  "px-2 sm:px-6 py-2 rounded-full font-light text-sm transition-colors",
                  section === "decorations"
                    ? "bg-[#2256A3] text-white shadow-lg"
                    : "bg-transparent text-[#2256A3] hover:text-[#0d264c]"
                )}
              >
                ของตกแต่ง
              </button>
            </div>
          </div>
          <div className="space-y-6 px-1 mx-1 sm:px-6 sm:mx-3 h-[112px] sm:h-[154px] overflow-y-auto">
            {generate(section)}
          </div>
          <div className="flex justify-end px-4 mt-1">
            <button
              className="flex items-center bg-[#2256A3] text-white px-6 py-2 space-x-1 rounded-full shadow-lg font-light"
              onClick={() => nextPage()}
            >
              <span>ถัดไป</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface Wish {
  name: string;
  content: string;
}

interface CreateWishProps {
  selected: Selected;
  wish: Wish;
  setWish: (wish: Wish) => void;
  nextPage: () => void;
  prevPage: () => void;
}

interface WishError {
  name: string[] | null;
  content: string[] | null;
}

const CreateWish: NextPage<CreateWishProps> = ({ selected, wish, setWish, nextPage, prevPage }) => {
  const CharLimits = {
    name: 64,
    content: 280,
  };

  const [error, setError] = useState<WishError>({ name: null, content: null });

  const validateValues = () => {
    let nameErrors = [];
    let contentErrors = [];

    if (wish.name.length === 0) nameErrors.push("โปรดกรอกข้อมูลดังกล่าว");
    if (wish.content.length === 0) contentErrors.push("โปรดกรอกข้อมูลดังกล่าว");

    setError({
      name: nameErrors.length === 0 ? null : nameErrors,
      content: contentErrors.length === 0 ? null : contentErrors,
    });

    return nameErrors.length === 0 && contentErrors.length === 0;
  };

  const formatError = (err: string[]) => {
    if (err.length === 1) return err[0];
    else return err.join(", ");
  };

  return (
    <>
      <div className="flex items-center fixed min-h-screen w-full top-0 z-20 px-10 font-ui">
        <div className="flex flex-col border border-white bg-white bg-opacity-20 backdrop-blur-lg h-[80vh] max-h-[650px] max-w-[525px] w-full mx-auto rounded-[34px]">
          <div className="h-full pt-8 pb-4 sm:pb-2 w-full">
            <h1 className="text-white text-2xl text-center mb-8">ใส่คำอธิษฐาน</h1>
            <div className="flex flex-col items-center">
              <div className="relative top-[-24px] sm:top-[-12px] mb-[-34px] sm:mb-[-30px]">
                <Kratong height="240px" offset="60px" selected={selected} />
              </div>
              <svg className="w-[240px]" viewBox="0 0 370 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse
                  cx="184.709"
                  cy="20"
                  rx="184.5"
                  ry="20"
                  fill="white"
                  fillOpacity="0.3"
                  style={{ mixBlendMode: "soft-light" }}
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col relative z-10 justify-between border border-white bg-white bg-opacity-40 h-full rounded-[34px] w-full pb-2">
            <div>
              <div className="flex flex-col space-y-2 justify-between w-full pt-6 px-4 max-h-[150px] sm:max-h-[240px] mt-3 overflow-y-auto">
                <div className="w-full">
                  <fieldset>
                    <label className="text-sm text-white" htmlFor="name">
                      ชื่อ
                    </label>
                    <input
                      name="name"
                      type="text"
                      onChange={(e) => {
                        if (CharLimits.name - e.target.value.length < 0) return;

                        setWish({
                          name: e.target.value,
                          content: wish.content,
                        });
                      }}
                      value={wish.name ?? ""}
                      className="block w-full mt-2 bg-transparent placeholder-[#f1f1f1] text-[#fff] outline-none border-b-2 border-white px-2 pt-2 pb-1 mb-4"
                      placeholder="นายเรียนเด่น เล่นดี"
                    />
                  </fieldset>
                  <div className="block mt-2 w-full">
                    <span className="text-sm text-red-600 float-left">{error.name && formatError(error.name)}</span>
                    <span className="text-sm text-white float-right">{CharLimits.name - wish.name.length}</span>
                  </div>
                </div>

                <div className="w-full">
                  <fieldset>
                    <label className="text-sm text-white" htmlFor="content">
                      ใส่คำอธิษฐาน
                    </label>
                    <input
                      name="content"
                      type="text"
                      onChange={(e) => {
                        if (CharLimits.content - e.target.value.length < 0) return;

                        setWish({
                          name: wish.name,
                          content: e.target.value,
                        });
                      }}
                      value={wish.content ?? ""}
                      className="block w-full mt-2 bg-transparent placeholder-[#eee] text-[#fdfdfd] outline-none border-b-2 border-white px-2 pt-2 pb-1  mb-4"
                      placeholder="ขอให้ได้คณะที่หวัง ขอให้มีหวานใจ สาธุ"
                    />
                  </fieldset>

                  <div className="block mt-2 w-full">
                    <span className="text-sm text-red-600 float-left">
                      {error.content && formatError(error.content)}
                    </span>
                    <span className="text-sm text-white float-right">{CharLimits.content - wish.content.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 px-4">
              <button
                className="flex items-center text-sm sm:text-md bg-transparent text-white border border-white px-6 py-2 space-x-1 rounded-full font-light"
                onClick={() => prevPage()}
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span>ย้อนกลับ</span>
              </button>

              <button
                className="flex items-center bg-[#2256A3] text-white px-6 py-2 rounded-full shadow-lg font-light"
                onClick={() => {
                  if (!validateValues()) return;

                  nextPage();
                }}
              >
                <span>ลอยกระทง !</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface ResultData {
  kratong: Selected;
  wish: Wish;
}

interface ResultProps {
  data: ResultData;
  prevPage: () => void;
}

const Result: NextPage<ResultProps> = ({ data, prevPage }) => {
  console.log(data);

  return (
    <>
      <div className="flex items-center fixed min-h-screen w-full top-0 z-20 px-10 font-ui">
        <div className="flex flex-col justify-center items-center space-y-6 border border-white bg-white bg-opacity-20 backdrop-blur-lg h-[80vh] max-h-[650px] max-w-[525px] w-full mx-auto rounded-[34px]">
          <div className="pt-8 pb-4 sm:pb-2 w-full">
            <h1 className="text-white text-2xl text-center mb-8">สำเร็จ</h1>
            <p className="text-white font-light text-lg text-center mb-2">{data.wish.name}:</p>
            <p className="text-white font-light text-sm text-center mb-2">{data.wish.content}</p>
          </div>
          <div className="flex justify-center w-full relative top-[-24px]">
            <Kratong height="240px" offset="60px" selected={data.kratong} />
          </div>
          <div className="justify-self-end flex justify-end space-x-2 px-4">
            <button
              className="relative z-40 flex items-center text-md bg-white text-[#2256A3] border border-white px-6 py-2 space-x-1 rounded-full font-light"
              onClick={() => prevPage()}
            >
              <ChevronLeftIcon className="w-5 h-5" />
              <span>กลับไปแก้ไขกระทง</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

interface KratongData {
  kratong: Selected;
  wish: Wish;
}

export const Create: NextPage = () => {
  const [data, setData] = useState<KratongData>({
    kratong: {
      base: "banana-leaf",
      flowers: "love",
      candles: "yellow",
      decorations: "nak",
      offset: 0,
    },
    wish: {
      name: "",
      content: "",
    },
  });

  const [page, setPage] = useState(1);

  const setKratong = (selection: Selected) => {
    setData((oldData) => {
      return {
        kratong: selection,
        wish: oldData.wish,
      };
    });
  };

  const setWish = (newWish: Wish) => {
    setData((oldData) => {
      return {
        kratong: oldData.kratong,
        wish: newWish,
      };
    });
  };

  const NextPage = () => {
    setPage((currPage) => (currPage === 3 ? currPage : currPage + 1));
  };

  const PrevPage = () => {
    setPage((currPage) => (currPage === 1 ? currPage : currPage - 1));
  };

  return (
    <>
      {page === 1 && <CreateKratong selected={data.kratong} setSelected={setKratong} nextPage={NextPage} />}
      {page === 2 && (
        <CreateWish
          wish={data.wish}
          setWish={setWish}
          selected={data.kratong}
          nextPage={NextPage}
          prevPage={PrevPage}
        />
      )}
      {page === 3 && <Result data={data} prevPage={PrevPage} />}
    </>
  );
};

const Draft = () => {
  return <></>;
};
