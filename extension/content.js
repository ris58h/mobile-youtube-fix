//See https://support.google.com/youtube/answer/7631406
const KEY_FUNCTION_MAP = {
	' ': togglePlayPause,
	// Play/Pause Media Key on keyboards: Play / Pause.
	'k': togglePlayPause,
	'm': toggleMutedUnmuted,
	// Stop Media Key on keyboards: Stop.
	// Next Track Media Key on keyboards: Moves to the next track in a playlist.
	'ArrowLeft': seekBackward(5),
	'ArrowRight': seekForward(5),
	'j': seekBackward(10),
	'l': seekForward(10),
	'<': slowDown,
	'>': speedUp,
	// Home/End on the seek bar: Seek to the beginning/last seconds of the video.
	'ArrowUp': increaseVolume(0.05),
	'ArrowDown': decreaseVolume(0.05),
	// Number 1 or Shift+1: Move between H1 headers.
	// '/': Go to search box.
	// 'f': Activate full screen. If full screen mode is enabled, activate F again or press escape to exit full screen mode.
	// 'c': Activate closed captions and subtitles if available. To hide captions and subtitles, activate C again.
	// 'N': Move to the next video (If you're using a playlist, will go to the next video of the playlist. If not using a playlist, it will move to the next YouTube suggested video).
	// 'P': Move to the previous video. Note that this shortcut only works when you're using a playlist.
	// 'i': Open the Miniplayer.
}
for (let i = 0; i < 10; i++) {
	KEY_FUNCTION_MAP['' + i] = seekPercent(i * 10)
}

window.addEventListener('keydown', (e) => {
	const f = KEY_FUNCTION_MAP[e.key]
	if (f) {
		f()
		e.preventDefault()
	}
})

function getVideo() {
	return document.getElementsByTagName('video')[0]
}

function seekBackward(sec) {
	return () => {
		const video = getVideo()
		video.currentTime = Math.max(video.currentTime - sec, 0)
	}
}

function seekForward(sec) {
	return () => {
		const video = getVideo()
		video.currentTime = Math.min(video.currentTime + sec, video.duration)
	}
}

function togglePlayPause() {
	const video = getVideo()
	if (video.paused) {
		video.play()
	} else {
		video.pause()
	}
}

function toggleMutedUnmuted() {
	const video = getVideo()
	video.muted = !video.muted
}

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

function slowDown() {
	const video = getVideo()
	const i = findClosestIndex(PLAYBACK_RATES, video.playbackRate)
	video.playbackRate = PLAYBACK_RATES[Math.max(i - 1, 0)]
}

function speedUp() {
	const video = getVideo()
	const i = findClosestIndex(PLAYBACK_RATES, video.playbackRate)
	video.playbackRate = PLAYBACK_RATES[Math.min(i + 1, PLAYBACK_RATES.length - 1)]
}

function findClosestIndex(values, value) {
	let res = null
	let e = 0
	for (let i = 0; i < values.length; i++) {
		const candidate = values[i]
		if (candidate == value) {
			return i
		}
		if (res == null) {
			res = i
			continue
		}
		const candidateE = Math.abs(value - candidate)
		if (candidateE < e) {
			res = i
			e = candidateE
			continue
		}
	}
	return res
}

function seekPercent(percent) {
	return () => {
		const video = getVideo()
		video.currentTime = video.duration / 100 * percent
	}
}

function increaseVolume(step) {
	return () => {
		const video = getVideo()
		video.volume = Math.min(video.volume + step, 1)
	}
}

function decreaseVolume(step) {
	return () => {
		const video = getVideo()
		video.volume = Math.max(video.volume - step, 0)
	}
}
