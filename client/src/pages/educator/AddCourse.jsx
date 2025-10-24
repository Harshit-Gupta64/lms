import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'

function Addcourse() {

  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [coursePrice, setCoursePrice] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)
  const [lectureDetai1s, setLectureDetai1s] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  })

  useEffect(() => {
    // Initialize Quill editor only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      })
    }
  }, [])

  // 🧩 Handle add/remove/toggle for chapters
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:')
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      )
    }
  }

  // 🧠 Handle adding/removing lectures inside chapters
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedLectures = [...chapter.chapterContent]
            updatedLectures.splice(lectureIndex, 1)
            return { ...chapter, chapterContent: updatedLectures }
          }
          return chapter
        })
      )
    }
  }

  // 🪄 Function to add lecture details to a chapter
  const handleAddLecture = () => {
    if (!lectureDetai1s.lectureTitle || !lectureDetai1s.lectureUrl) {
      alert('Please fill all details before adding!')
      return
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, { ...lectureDetai1s }],
          }
        }
        return chapter
      })
    )

    // Reset input fields + close popup
    setLectureDetai1s({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    })
    setShowPopup(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here    
  }

  return (
    <>
      <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
          {/* Course Title */}
          <div className="flex flex-col gap-1">
            <p>Course Title</p>
            <input
              onChange={(e) => setCourseTitle(e.target.value)}
              value={courseTitle}
              type="text"
              placeholder="Type here"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-50"
              required
            />
          </div>

          {/* Course Description (Quill Editor) */}
          <div className="flex flex-col gap-1">
            <p>Course Description</p>
            <div ref={editorRef}></div>
          </div>

          {/* Price + Thumbnail */}
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex flex-col gap-1">
              <p>Course Price</p>
              <input
                onChange={(e) => setCoursePrice(e.target.value)}
                value={coursePrice}
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-50"
                required
              />
            </div>
            <div className="flex md:flex-row flex-col items-center gap-3">
              <p>Course Thumbnail</p>
              <label htmlFor="thumbnailImage" className="flex items-center gap-3">
                <img src={assets.file_upload_icon} alt="" className="p-3 bg-blue-500 rounded" />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  type="file"
                  id="thumbnailImage"
                  hidden
                />
                <img className="max-h-10" src={image ? URL.createObjectURL(image) : ''} alt="" />
              </label>
            </div>
          </div>

          {/* Discount */}
          <div className="flex flex-col gap-1">
            <p>Discount %</p>
            <input
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              type="number"
              placeholder="0"
              min={0}
              max={100}
              className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-50"
              required
            />
          </div>

          {/* Chapters + Lectures */}
          <div>
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="bg-white border rounded-lg mb-4">
                <div className="flex justify-between items-center p-4 border-b">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                  >
                    <img
                      src={assets.dropdown_icon}
                      width={14}
                      className={`mr-2 transition-all ${chapter.collapsed && '-rotate-90'}`}
                      alt=""
                    />
                    <span className="font-semibold">
                      {chapterIndex + 1}. {chapter.chapterTitle}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {chapter.chapterContent.length} Lectures
                  </span>
                  <img
                    src={assets.cross_icon}
                    alt=""
                    className="cursor-pointer"
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                  />
                </div>

                {!chapter.collapsed && (
                  <div className="p-4">
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div
                        key={lectureIndex}
                        className="flex justify-between items-center mb-2"
                      >
                        <span>
                          {lectureIndex + 1}. {lecture.lectureTitle} -{' '}
                          {lecture.lectureDuration} mins -{' '}
                          <a
                            href={lecture.lectureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            Link
                          </a>{' '}
                          - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                        </span>
                        <img
                          src={assets.cross_icon}
                          alt=""
                          className="cursor-pointer"
                          onClick={() =>
                            handleLecture('remove', chapter.chapterId, lectureIndex)
                          }
                        />
                      </div>
                    ))}
                    <div
                      className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                      onClick={() => handleLecture('add', chapter.chapterId)}
                    >
                      + Add Lecture
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Chapter Button */}
            <div
              className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
              onClick={() => handleChapter('add')}
            >
              + Add Chapter
            </div>

            {/* Popup for Adding Lectures */}
            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                  <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

                  {/* Lecture Title */}
                  <div className="mb-2">
                    <p>Lecture Title</p>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded py-1 px-2"
                      value={lectureDetai1s.lectureTitle}
                      onChange={(e) =>
                        setLectureDetai1s({
                          ...lectureDetai1s,
                          lectureTitle: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Lecture Duration */}
                  <div className="mb-2">
                    <p>Duration (minutes)</p>
                    <input
                      type="number"
                      className="mt-1 block w-full border rounded py-1 px-2"
                      value={lectureDetai1s.lectureDuration}
                      onChange={(e) =>
                        setLectureDetai1s({
                          ...lectureDetai1s,
                          lectureDuration: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Lecture URL */}
                  <div className="mb-2">
                    <p>Lecture URL</p>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded py-1 px-2"
                      value={lectureDetai1s.lectureUrl}
                      onChange={(e) =>
                        setLectureDetai1s({
                          ...lectureDetai1s,
                          lectureUrl: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Is Preview Free */}
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="scale-125"
                      checked={lectureDetai1s.isPreviewFree}
                      onChange={(e) =>
                        setLectureDetai1s({
                          ...lectureDetai1s,
                          isPreviewFree: e.target.checked,
                        })
                      }
                    />
                    <p>Is Preview Free?</p>
                  </div>

                  {/* Add Lecture Button */}
                  <button
                    type="button"
                    onClick={handleAddLecture}
                    className="w-full bg-blue-400 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>

                  {/* Close Popup */}
                  <img
                    src={assets.cross_icon}
                    onClick={() => setShowPopup(false)}
                    className="absolute top-4 right-4 w-4 cursor-pointer"
                    alt=""
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-black text-white w-max py-2.5 px-8 rounded my-4"
          >
            ADD
          </button>
        </form>
      </div>
    </>
  )
}

export default Addcourse
