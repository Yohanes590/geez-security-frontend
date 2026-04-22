export const DiscountFunction = async () => {
    const DsicountRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/courses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const DsicountResponse = await DsicountRequest.json();
    // console.log(DsicountResponse)
    return {
        GTCRTDiscount: DsicountResponse.data[0].discount || 0,
        GTWSSDiscount: DsicountResponse.data[1].discount || 0,
        GTSTDiscount: DsicountResponse.data[2].discount || 0
    }
}

export const CourseStatus = async () => {
    const CourseStatusRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/courses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const CourseStatusResponse = await CourseStatusRequest.json();
    console.log(CourseStatusResponse)
    return [
        CourseStatusResponse.data[0].status.toLowerCase() == 'active' ? '' : 'gtcrt',
        CourseStatusResponse.data[1].status.toLowerCase() == 'active' ? '' : 'gtwss',
        CourseStatusResponse.data[2].status.toLowerCase() == 'active' ? '' : 'gtst'
    ]


}