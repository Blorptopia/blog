# This builds and tests everything
bazel test //...
# This pushes every image to our container registry
bazel run //:push-oci-images
