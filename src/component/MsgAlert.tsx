import { type Ref, forwardRef, useEffect, useState } from "react";


export const MsgAlertType = {
    INFO: "INFO",
    SUCCESS: "SUCCESS", 
    WARN: "WARN",
    FAILED: "FAILED"
} as const

export type MsgAlertType = keyof typeof MsgAlertType

export type MsgAlertRef = {
    showAlert: (msg: string, msgType: keyof typeof MsgAlertType) => void;
};

type MsgAlertProps = {
}


export const MsgAlert = forwardRef<MsgAlertRef, MsgAlertProps>((props, ref: Ref<MsgAlertRef>) => {

    const [show, setShow] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<keyof typeof MsgAlertType>(MsgAlertType.SUCCESS)

    useEffect(() => {
        if (ref) {
            (ref as any).current = {
                showAlert: (msg: string, msgType: keyof typeof MsgAlertType) => {
                    setMsg(msg)
                    setShow(true)
                    setMsgType(msgType)
                    setTimeout(() => {
                        setShow(false)
                    }, 3000)
                }
            }
        }
    }, [])

    const renderMsgAlert = () => {
        if (msgType === MsgAlertType.SUCCESS) {
            return <SuccessMsgAlert msg={msg} />
        } else if (msgType === MsgAlertType.WARN) {
            return <WarningMsgAlert msg={msg} />
        } else if (msgType === MsgAlertType.FAILED) {
            return <FailedMsgAlert msg={msg} />
        } else if (msgType === MsgAlertType.INFO) {
            return <InfoMsgAlert msg={msg} />
        }
        return <></>
    }

    return (
        <div className=" fixed top-0 left-0 right-0 z-50" style={{ visibility: show ? "visible" : "hidden" }}>
            {renderMsgAlert()}
        </div>
    )
})

MsgAlert.displayName = 'MsgAlert'

const InfoMsgAlert = ({ msg }: { msg: string }) => {

    return (
        <>
            <div className="alert flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{msg}</span>
            </div>
        </>
    )
}

const SuccessMsgAlert = ({ msg }: { msg: string }) => {

    return (
        <>
            <div className="alert alert-success flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{msg}</span>
            </div>
        </>
    )
}

const FailedMsgAlert = ({ msg }: { msg: string }) => {

    return (
        <>
            <div className="alert alert-error flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{msg}</span>
            </div>
        </>
    )
}

const WarningMsgAlert = ({ msg }: { msg: string }) => {
    return (
        <div className="alert alert-warning flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{msg}</span>
        </div>
    )
}
