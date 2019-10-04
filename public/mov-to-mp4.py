from moviepy.editor import VideoFileClip, vfx
from PIL import Image
import imageio
import shutil
import imghdr
import numpy
import rawpy
import time
import sys
import os

# no dir provided
if len(sys.argv) <= 1:
    print("give me a dir")
    exit()

_dir = sys.argv[1]

# bad dir
if not os.path.isdir(_dir):
    print("give me a single dir that exists")
    exit()
# current dir
elif _dir.startswith("."):
    print("plz no parent dir shenanigans")
    exit()

# log to an error file
def log_error(err):
    with open("mov_mp4_errors", mode="a+") as err_file:
        err_file.writelines("{}\n".format(err))

# recursive func to traverse dirs and convert
# photos into small jpgs
def convert_mov_to_mp4(_next_dir):
    print("Next Dir: {}".format(_next_dir))

    # current dir being converted
    _this_dir = _next_dir

    # loop through them files
    for file in os.listdir(_this_dir):
        # full file path including given dir
        _this_file = "{}/{}".format(_this_dir, file)
        # file is dir, recurse
        if (os.path.isdir(_this_file)):
            convert_mov_to_mp4(_this_file)
        # not a dir, check if valid file we want
        else:
            file_ext = os.path.splitext(file)[1].lower()
            # video files
            if file_ext == ".mov":
                print(_this_file)
                # try:
                video = VideoFileClip(_this_file).fx(vfx.resize, width=1000)
                out_file = "{}/{}.mp4".format(_this_dir, file)
                video.write_videofile(out_file,
                    audio_codec="aac",
                    temp_audiofile="temp-audio.m4a",
                    remove_temp=True
                )
                os.remove(_this_file)
                # except :
                #     print("Error: {}".format(_this_file))
                #     log_error(_this_file)

# start at given dir
convert_mov_to_mp4(_dir)
