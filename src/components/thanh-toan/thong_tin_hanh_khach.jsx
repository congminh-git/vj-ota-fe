'use client';

import { useState } from 'react';

export default function PassengersInfomation({ listPassengers }) {
    const [showInfo, setShowInfo] = useState(false);
    return (
        <div className="bg-white p-4 rounded-md">
            <button
                onClick={() => {
                    setShowInfo(!showInfo);
                }}
                className="flex items-center bg-sky-400 w-full p-2 border-b rounded"
            >
                <span className="mr-2 text-white font-bold">Thông tin hành khách</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={`size-4 mr-2 ${showInfo ? 'hidden' : 'block'}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={`size-4 mr-2 ${showInfo ? 'block' : 'hidden'}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            </button>
            <div className={`p-3 border-b ${showInfo ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-3 gap-4 font-medium">
                    <div className="col-span-1 text-sm">
                        <p>Người lớn (x{listPassengers?.listAdult.length})</p>
                        {listPassengers?.listAdult.map((item, index) => {
                            return (
                                <div key={index}>
                                    <p className="flex items-center">
                                        <span>{item.lastName + ' ' + item.firstName}</span>
                                        <span className="mx-2 h-2 w-2 bg-gray-200 rounded-full"></span>
                                        <span>{item.gender == 'nam' ? 'Ông' : 'Bà'}</span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-span-1 text-sm">
                        <p>
                            Trẻ em (x{listPassengers?.listChild.length}){' '}
                            <span className="text-sx text-sky-400 ml-2">{'(2-11 tuổi)'}</span>
                        </p>
                        {listPassengers?.listChild.map((item, index) => {
                            return (
                                <div key={index}>
                                    <p className="flex items-center">
                                        <span>{item.lastName + ' ' + item.firstName}</span>
                                        <span className="mx-2 h-2 w-2 bg-gray-200 rounded-full"></span>
                                        <span>{item.gender == 'nam' ? 'Nam' : 'Nữ'}</span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-span-1 text-sm">
                        <p>
                            Em bé (x{listPassengers?.listInfant.length}){' '}
                            <span className="text-sx text-sky-400 ml-2">{'(<2 tuổi)'}</span>
                        </p>
                        {listPassengers?.listInfant.map((item, index) => {
                            return (
                                <div key={index}>
                                    <p className="flex items-center">
                                        <span>{item.lastName + ' ' + item.firstName}</span>
                                        <span className="mx-2 h-2 w-2 bg-gray-200 rounded-full"></span>
                                        <span>{item.gender == 'nam' ? 'Nam' : 'Nữ'}</span>
                                    </p>
                                    <p>Ngày sinh: {`${item.dob}`}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}